const axios = require("axios");
const mcache = require("memory-cache");

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

const express = require("express");
const router = express.Router();

const baseApi = "https://fakestoreapi.com";
const productUrl = `${baseApi}/products`;
const cartUrl = `${baseApi}/carts`;

const CACHE_TIME = 30 * 60 * 1000;

const cache = (duration) => {
 return (req, res, next) => {
  let key = "__express__" + req.originalUrl || req.url;
  let cachedBody = mcache.get(key);
  if (cachedBody) {
   res.send(cachedBody);
   return;
  } else {
   res.sendResponse = res.send;
   res.send = (body) => {
    mcache.put(key, body, duration);
    res.sendResponse(body);
   };
   next();
  }
 };
};

const getProduct = (productId) => {
 return axios
  .get(`${productUrl}/${productId}`)
  .then((response) => response.data)
  .catch((error) => {
   console.log(error.message);
  });
};

const getCart = (cartId) => {
 return axios
  .get(`${cartUrl}/${cartId}`)
  .then((response) => response.data)
  .catch((error) => {
   console.log(error.message);
  });
};

const getFiveCart = (limit) => {
 return axios
  .get(`${cartUrl}?limit=${limit}`)
  .then((response) => response.data)
  .catch((error) => {
   console.log(error.message);
  });
};

const patchCart = (cartId, patchData) => {
 return axios
  .patch(`${cartUrl}/${cartId}`, { data: patchData })
  .then((res) => res.data)
  .catch((error) => console.log(error.message));
};

router.get("/products/:productId", cache(CACHE_TIME), async (req, res) => {
 const productId = req.params.productId;
 const product = await getProduct(productId);
 if (!product) {
  res.status(404).send();
 } else {
  res.send(product);
 }
});

router.get("/carts", cache(CACHE_TIME), async (req, res) => {
 const limit = req.query.limit;
 const carts = await getFiveCart(limit);
 if (!carts) {
  res.status(404).send();
 } else {
  res.send(carts);
 }
});

router.get("/carts/:cartId", cache(CACHE_TIME), async (req, res) => {
 const cartId = req.params.cartId;
 const cart = await getCart(cartId);
 if (!cart) {
  res.status(404).send();
 } else {
  res.send(cart);
 }
});

router.patch(`/carts/:cartId`, async (req, res) => {
 const cartId = req.params.cartId;
 const patchData = req.body;
 const patchedData = await patchCart(cartId, patchData);
 if (!patchedData) {
  res.status(404).send();
 } else {
  res.send(patchData);
 }
});

module.exports = router;
