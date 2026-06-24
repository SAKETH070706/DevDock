const CHARACTERS ="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export const generateRoomCode=(length=6)=>
{
    let code="";
    for(let i=0;i<length;i++)
    {
        const randomIndex=Math.floor(Math.random()*CHARACTERS.length);
        code+=CHARACTERS[randomIndex];
    }
    return code;
}
