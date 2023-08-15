export default async function uploadImage(fileBlob) {
  
  const buffer = Buffer.from(await fileBlob.arrayBuffer())

  const blob = new Blob([buffer]);
  
  const formdata = new FormData()
  formdata.set("image", blob, fileBlob.name)

  const response = await fetch(process.env.IMGBB_UPLOAD_URL, {
    method: "POST",
    body: formdata,
  });
  if (!response.ok) {
    throw new Error("An error ocurred while uploading the image.");
  }
  
  const data = await response.json();

  
  return data.data.url;
  }