
export async function GetSingleProduct(id) {
   return  fetch(`https://auction-api.devssh.xyz/api/v1/user/product/${id}`, {
       method: "GET", cache: "no-cache",
       headers: {
           "Accept": "application/json",
           "Authorization":""
       }
   }).then(res => res.json())
}