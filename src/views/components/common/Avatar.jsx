const AVATARS = {
    "robot_blue_v1": "https://api.dicebear.com/9.x/bottts/svg?seed=Lumen1",
    "robot_pink_v1": "https://api.dicebear.com/9.x/bottts/svg?seed=Lumen2",
    "robot_yellow_v1": "https://api.dicebear.com/9.x/bottts/svg?seed=Lumen3",
    "robot_green_v1": "https://api.dicebear.com/9.x/bottts/svg?seed=Lumen4",
    "default": "https://api.dicebear.com/9.x/bottts/svg?seed=Guest"
};

const Avatar = ({ src, size = "md" }) => { 

    const image = AVATARS[src] || AVATARS["default"];

    const sizeClasses = {
        sm: "w-8 h-8",     
        md: "w-12 h-12", 
        lg: "w-24 h-24",  
        xl: "w-32 h-32"   
    };

    return (

        <div className={`relative inline-block rounded-full border-2 border-gray-600 shadow-sm bg-gray-700 ${sizeClasses[size]}`}>
            <img 
                src={image} 
                alt="User Avatar"
                className="w-full h-full object-cover rounded-full p-1"
            />
        </div>
    )
}

export default Avatar;