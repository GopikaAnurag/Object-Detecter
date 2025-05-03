const Log = require('../models/logmodel')

const createLog = async(req,res) => {
    try{
        const newlog = new Log(req.body)
        await newlog.save()
        res.status(200).json('log saved')
    }catch(err){
       res.status(500).json('error saving log',err)
    }
}


const getLog = async(req,res) => {
    try{
        const logs = await Log.find()
        res.status(200).json(logs)
    }catch(err){
       res.status(500).json('Error fetching logs',err)
    }
}


module.exports = { createLog, getLog }