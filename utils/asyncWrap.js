module.exports =(fxn)=>{
   return function(req,res,next){
    fxn(req,res,next).catch((err)=>
    next(err));
   }
}