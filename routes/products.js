import express from "express";
const router = express.Router();
import productsModel from "../models/products.js";

router.post("/", async (req,res) =>{
    try{
        const data = await productsModel.create(req.body);
        res.status(200).json(data);
    } catch({message}){
        res.json({message});
    }
});

router.get("/", async (req, res) => {
    try {
      const filter = {};

      if(req.query.company){
        filter.company = req.query.company;
      }
      if(req.query.price){
        if(typeof req.query.price === "object"){
            if(req.query.price.gt){
                filter.price = {...filter.price, $gt: req.query.price.gt};
            }
            if(req.query.price.lt){
                filter.price = {...filter.price, $lt: req.query.price.lt};
            }
        } else {
            filter.price = req.query.price;
        }
      }

      if(req.query.stock){
        if(typeof req.query.stock === "object"){
            if(req.query.stock.gt){
                filter.stock = {...filter.stock, $gt: req.query.stock.gt};
            }
            if(req.query.stock.lt){
                filter.stock = {...filter.stock, $lt: req.query.stock.lt};
            }
        } else {
            filter.stock = req.query.stock;
        }
      }

      if(req.query.search){
        filter.$or = [
            { name: { $regex: req.query.search, $options: "i"}},
            { company: { $regex: req.query.search, $options: "i"}},
        ];
      }

      const sort = {};
      if(req.query.sort){
        if(typeof req.query.sort === "object"){
            req.query.sort.forEach((element) =>{
                if(element.startsWith("-")){
                    sort[element.substring(1)] = -1;
                } else {
                    sort[element] = 1;
                }
            });
        } else{
            if(req.query.sort.startsWith("-")){
                sort[req.query.sort.substring(1)] = -1;
            } else {
                sort[req.query.sort] = 1;
            }
        }
      }

      const data = await productsModel.find(filter).sort(sort);
      res.json({message: "Data fetched successfully.",data});
    } catch ({ message }) {
      res.json({ message });
    }
  });

  router.get("/pipe", async (req, res) => {
    try {
      const pipeline = [];
  
      if (req.query.name) {
        pipeline.push({
          $match: {
            name: req.query.name,
          },
        });
      }
  
      if (req.query.company) {
        pipeline.push({
          $match: {
            company: req.query.company,
          },
        });
      }
  
      if (req.query.price) {
        if (typeof req.query.price === "object") {
          if (req.query.price.gt) {
            pipeline.push({
              $match: {
                price: { $gt: Number(req.query.price.gt) },
              },
            });
          }
          if (req.query.price.lt) {
            pipeline.push({
              $match: {
                price: { $lt: Number(req.query.price.lt) },
              },
            });
          }
        } else {
          pipeline.push({
            $match: {
              price: Number(req.query.price),
            },
          });
        }
      }
  
      if (req.query.stock) {
        if (typeof req.query.stock === "object") {
          if (req.query.stock.gt) {
            pipeline.push({
              $match: {
                stock: { $gt: Number(req.query.stock.gt) },
              },
            });
          }
          if (req.query.stock.lt) {
            pipeline.push({
              $match: {
                stock: { $lt: Number(req.query.stock.lt) },
              },
            });
          }
        } else {
          pipeline.push({
            $match: {
              stock: Number(req.query.stock),
            },
          });
        }
      }
  
      if (req.query.search) {
        pipeline.push({
          $match: {
            $or: [
              { name: { $regex: req.query.search, $options: "i" } },
              { company: { $regex: req.query.search, $options: "i" } },
            ],
          },
        });
      }
  
      const data = await productsModel.aggregate(pipeline);
      res.send({ message: "Data fetched successfully.", data });
    } catch ({ message }) {
      res.json({ message });
    }
  });
    
router.get("/:id", async (req,res) =>{
    try{
    const data = await productsModel.findById(req.params.id);
    res.json(data);
    } catch({message}){
        res.json({message});
    }
});

router.patch("/:id", async (req,res) =>{
    try{
        const data = await productsModel.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json(data);
    } catch({message}){
        res.json({message});
    }
});

router.delete("/:id", async (req,res) =>{
    try{
        const data = await productsModel.findByIdAndDelete(req.params.id);
        res.status(200).json(data);
    } catch({message}){
        res.json({message});
    }
});

router.delete("/", async (req, res) => {
    try {
        const result = await productsModel.deleteMany();
        res.status(200).json(result);
    } catch ({ message }) {
        res.json({ message });
    }
});

export default router;