import mongoose from "mongoose";
import dotenv from "dotenv";
import Car from "./models/Car.js";

dotenv.config();

const dbUri = process.env.MONGO_URI;

mongoose
  .connect(dbUri)
  .then(async () => {
    console.log("Connected to the database");

    const cars = [
      {
        title: "Toyota Camry",
        pricePerDay: 5000,
        location: "Lekki, Lagos",
        image: "/assets/toyota-camry.jpg",
      },
      {
        title: "Honda Civic",
        pricePerDay: 4000,
        location: "Ikeja, Lagos",
        image: "/assets/honda-civic.jpg",
      },
      {
        title: "Nissan Altima",
        pricePerDay: 6000,
        location: "Surulere, Lagos",
        image: "/assets/nissan-altima.jpg",
      },
      {
        title: "Mazda 6",
        pricePerDay: 5500,
        location: "Victoria Island, Lagos",
        image: "/assets/mazda-6.jpg",
      },
      {
        title: "BMW X5",
        pricePerDay: 12000,
        location: "Yaba, Lagos",
        image: "/assets/bmw-x5.jpg",
      },
      {
        title: "Mercedes-Benz C-Class",
        pricePerDay: 9000,
        location: "Festac, Lagos",
        image: "/assets/mercedes-c-class.jpg",
      },
      {
        title: "Ford Escape",
        pricePerDay: 7000,
        location: "Ajah, Lagos",
        image: "/assets/ford-escape.jpg",
      },
      {
        title: "Hyundai Elantra",
        pricePerDay: 4500,
        location: "Apapa, Lagos",
        image: "/assets/hyundai-elantra.jpg",
      },
      {
        title: "Kia Sportage",
        pricePerDay: 4800,
        location: "Ogba, Lagos",
        image: "/assets/kia-sportage.jpg",
      },
      {
        title: "Lexus RX 350",
        pricePerDay: 13000,
        location: "Lekki, Lagos",
        image: "/assets/lexus-rx350.jpg",
      },
      {
        title: "Toyota Corolla",
        pricePerDay: 4000,
        location: "Ikeja, Lagos",
        image: "/assets/toyota-corolla.jpg",
      },
      {
        title: "Honda CR-V",
        pricePerDay: 7500,
        location: "Ikorodu, Lagos",
        image: "/assets/honda-crv.jpg",
      },
      {
        title: "Chevrolet Malibu",
        pricePerDay: 5000,
        location: "Apapa, Lagos",
        image: "/assets/chevrolet-malibu.jpg",
      },
      {
        title: "2011 Ford Mustang GT",
        pricePerDay: 10000,
        location: "Victoria Island, Lagos",
        image: "/assets/ford-mustang.jpg",
      },
      {
        title: "Toyota Rav4 LE AWD",
        pricePerDay: 8500,
        location: "Surulere, Lagos",
        image: "/assets/toyota-rav4.jpg",
      },
      {
        title: "Audi A4",
        pricePerDay: 11000,
        location: "Yaba, Lagos",
        image: "/assets/audi-a4.jpg",
      },
    ];

    try {
      await Car.deleteMany();
      await Car.insertMany(cars);
      console.log("Sample cars inserted successfully");
    } catch (err) {
      console.error("Error inserting cars:", err);
    } finally {
      mongoose.connection.close();
    }
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });
