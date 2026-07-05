const colors=[
"#ef4444",
"#22c55e",
"#3b82f6",
"#f97316",
"#8b5cf6",
"#ec4899",
"#14b8a6",
"#eab308",
];

export const getUserColor=(userId)=>{

    let hash=0;

    for(let i=0;i<userId.length;i++){

        hash+=userId.charCodeAt(i);

    }

    return colors[hash%colors.length];

}