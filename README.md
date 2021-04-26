<br />
<p align="center">
  <h3 align="center">Droppe Xmas</h3>

  <p align="center">
    Cart Approval
    <br />
    <a href="https://droppe-assignment-xmas.herokuapp.com/">View Demo</a>
    ·
    <a href="https://github.com/jimmytran411/Droppe-xmas/issues">Report Bug</a>
    ·
    <a href="https://github.com/jimmytran411/Droppe-xmas/issues">Request Feature</a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#testing">Testing</a></li>
      </ul>
    </li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

The project is a cart approval process for parents. The theme is an imaginary christmas gift picking marketplace. The primary user persona of your interface will be a 50 year old parent with differing (usually low) levels of tech nativeness.
This is the Frontend version. The backend can be access at [Droppe-xmas-backend](https://github.com/jimmytran411/Droppe-xmas-backend)

### Built With

- [Create React App TypeScript](https://create-react-app.dev/docs/adding-typescript/)
- [TypeScript](https://www.typescriptlang.org/)
- [React Testing Library](https://testing-library.com/)

## Getting Started

To get a local copy up and running follow these simple steps.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/jimmytran411/Droppe-xmas.git
   ```
2. Install dependencies
   After cloning the repo, you need to install dependencies in both frontend and backend.
   To install the frontend:
   ```sh
   cd frontend
   npm install
   ```
   From there, to install backend:

```sh
cd .../backend
npm install
```

3. Run the App at localhost:
   After installing the dependencies, make sure you have nodemon installed globally.
   To install nodemon globally:

```sh
npm install -g nodemon
```

If you don't want to install nodemon, in the /backend/package.json file, replace the line 10 by this:
```sh
"dev": "concurrently \"npm run server\" \"npm run frontend\"",
```

After that, you can run the app using the following command:

```sh
npm start
```

### Testing

The project has unit tests for its components using [React Testing Library](https://testing-library.com/)
To run the test, use the command:

```sh
npm run test
```

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->

## Contact

An Tran - [LinkedIn](https://www.linkedin.com/in/an-tran-204/) - email: jimmytran411@gmail.com

Project Link: [https://github.com/jimmytran411/Droppe-xmas](https://github.com/jimmytran411/Droppe-xmas)
