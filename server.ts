import app from './controller/app'



const port  = process.env.PORT || 3000;

app.listen(port,()=>{ 
    console.log('hello from listener ... ')
})
