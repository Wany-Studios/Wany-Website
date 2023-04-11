const SERVER = "http://localhost:8000/";

return new Promise(async resolve => {
    const a = await import("../../lib/axios/axios.min.js");
    console.log(a)
})