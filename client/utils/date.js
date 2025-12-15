export const getFormattedDate = (isoDate)=>{
    if(!isoDate) return;
    // const isoDate = "2025-11-25T08:21:00.000Z";
    const localDate = new Date(isoDate).toLocaleDateString();
    const localTime = new Date(isoDate).toLocaleTimeString('en-US', {
        hour12: false
    })

    console.log("Local Date: ", localDate);
    console.log("Local Time:", localTime);

    const splittedDate = localDate.split("/");
    const splittedTime = localTime.split(":");

    const formattedDateTime = `${splittedDate[2]}-${splittedDate[0].padStart(2, "0")}-${splittedDate[1].padStart(2, "0")}T${splittedTime[0].padStart(2, "0")}:${splittedTime[1].padStart(2, "0")}:${splittedTime[2].padStart(2, "0")}`;

    console.log(formattedDateTime);

    return formattedDateTime

}

getFormattedDate();