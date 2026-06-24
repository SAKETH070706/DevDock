import {createRoom,joinRoom,getRoomById,disbandRoom,leaveRoom} from "../services/roomService.js";

export const createRoomController=async(req,res)=>{
    try{
        const {roomName,language}=req.body;

        const result=await createRoom(roomName,language,req.user._id);

        return res.status(201).json({
                success: true,
                ...result
            });
    }
    catch(error)
    {
          return res.status(400).json({
                success: false,
                message: error.message
            });
    }
};

export const joinRoomController=async(req,res)=>{
    try{
        const {inviteCode}=req.body;

        const room =await joinRoom(inviteCode,req.user._id);

         return res.status(200).json({
                success: true,
                room
            });

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }
};

export const getRoomController=async(req,res)=>{
    try{
        const room=await getRoomById(req.params.roomId);
        
        return res.status(200).json({
                success: true,
                room
            });

        } catch (error) {

            return res.status(404).json({
                success: false,
                message: error.message
            });

        }
    
};

export const disbandRoomController=async(req,res)=>{
    try{
        const result=await disbandRoom(req.params.roomId,req.user._id);
          
        return res.status(200).json(
                result
            );

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }
    
};

export const leaveRoomController=async(req,res)=>
{
    try{
        const{roomId}=req.body;

        const room=await leaveRoom(roomId,req.user._id);
        
        return res.status(200).json({
                success: true,
                room
            });

        } catch (error) {

            return res.status(400).json({
                success: false,
                message:
                    error.message
            });

        }
};


        
 


