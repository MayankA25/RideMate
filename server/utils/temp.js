const rides = [
    {
        id: 1,

        passengers: [
            { id: 123 },
            { id: 456 }
        ]
    },
    {
        id: 2,
        
        passengers: [
            { id: 789 },
            { id: 198 }
        ]
    },
    {
        id: 3,
        
        passengers: [
            { id: 123 },
            { id: 789 }
        ]
    }
]


const temp = 789;

const foundRides = rides.filter((ride, index)=>{
    let found = false;
    for(let i = 0; i<ride.passengers.length; i++){
        if(ride.passengers[i].id == temp){
            found = true;
            break;
        }
    }
    if(found){
        return ride;
    }
})

console.log("Found Ride: ", foundRides);