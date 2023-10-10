//içeri aktarma
const fs = require("fs/promises");// dosya işlemleri
const express = require("express");//express.js
const cors = require("cors");//cors
const _ = require("lodash");//lodash
const { v4 : uuid} = require("uuid");//uuid
const { sendStatus } = require("express/lib/response");

const app = express();//express uygulaması oluşur.

app.use(express.json());//json verilerini kullanmak için ara yazılım.


//diziden rastgele veri çekme
app.get("/outfit",(req,res)=> {
    const top = ["mavi","siyah","gri"];
    const jeans = ["turuncu", "yeşil","siyah"];
    const shoes = ["mor","sarı","turkuaz"];

    res.json({
       top: _.sample(top),
       jeans : _.sample(jeans),
       shoes: _.sample(shoes)
    });
});

//girilen commentleri id ye göre getirme 
app.get("/comments/:id", async (req,res) => {
 const id = req.params.id;
 let content ; 

 try {
    content = await fs.readFile(`data/comments/${id}.txt`,"utf-8");
 } catch (error) {
    res.sendStatus(404);
 }

 res.json({
    content: content
 });
});

//comment oluşturma
app.post("/comments", async (req,res) => {
   const id = uuid();
   const content = req.body.content;
   
   if(!content){
    return res.sendStatus(400);
   }

   await fs.mkdir("data/comments", {recursive : true});
   await fs.writeFile(`data/comments/${id}.txt`, content);

   res.status(201).json({id:id});
});

//commentleri idye göre güncelleme
app.put("/comments/:id",  async (req,res) => {
    const id = req.params.id;
    const content = req.body.content;
    
    if(!content){
        return res.sendStatus(400);
    }

    try {
        await fs.writeFile(`data/comments/${id}.txt`, content);
        return res.status(204).json({content:content});
    } catch (error) {
        return res.sendStatus(404);
    }
});
//commentleri id ye göre silme
app.delete("/comments/:id",  async (req,res) => {
    const id = req.params.id;
   try {
    await fs.unlink(`data/comments/${id}.txt`);
    return res.sendStatus(204);
   } catch (error) {
    return res.sendStatus(404);
   }
});
//3000 portta ayağa kalkıyor.
app.listen(3000, () => console.log("API Server"));