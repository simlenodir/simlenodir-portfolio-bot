import fetch from "node-fetch";

export const geo = async(lat, long) => {
    const location = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=87f526f534114673b84ec3e7d9b3adda`)

    const { results: [ formatted ] } = await location.json()

    return formatted.formatted
}