// this is a wrapper funtion for handling all the async functions and return their 
//  result


const asynchandler = (func) => async (req,res,next)=>{

    try {
    return    await func(req,res,next)
    } catch (error) {
        console.log('Error details:', error); // Log the full error object
    const statusCode = error.code && Number.isInteger(error.code) && error.code >= 100 && error.code <= 599 
      ? error.code 
      : 500;
        res.status(statusCode || 500 )
        .json({success:false,        // to tell frontend developer that database is connected or not
               message : error.message
        })
    }
} 


/*
const asynchandler = (requeshandler)=>{( req,res,next)=>{
    Promise.resolve(requeshandler(req,res,next))
    .catch((err)=>next(err))
}}
    */

export default asynchandler