  <script>
  import maplibregl from 'maplibre-gl';
  import { onMount } from 'svelte';
  import Modal from '../lib/Modal.svelte'
  import 'maplibre-gl/dist/maplibre-gl.css';
  import { Input, Label, Button, Checkbox, A } from "flowbite-svelte";
  import { getDatabase, ref, child, push, update, set,query,get,onValue, remove } from "firebase/database";  
  import db from '$lib/firebase.js'
  import storage from '$lib/firebase.js'
  import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
  import { ref as dbRef } from "firebase/database";

  /** @type {import('./$types').PageProps} */
	let { data, form } = $props();
  let map;
  let mapContainer;
  let modalOpen = $state(false)
  let modalContent = $state('');
  let markerColor = $state('');
  let numMarkers = 0;
  let color = $state('')
  let data2=$state(JSON);
  let openPost = $state(false);
  let marker = $state(null);
  let author = $state(''); // let author = $state['']
  let report =$state('');
  let currentlongitude;
  let currentlatitude;
  let topButtons = true;
  let openSearch = $state(false);
  let markers = [
    
  ];
  let id = $state("");
  let keys = $state()
  let allMarkers = []

  let file;
  
  // let name = '';

  // openPost = false;
  async function uploadImage() {
    if (!file) return alert("Please select a file.");
    try {
    const uniqueName = `${Date.now()}_${file.name}`;

      const imageRef = storageRef(storage.storage, `images/${uniqueName}`);

      // Upload file to Firebase Storage
      await uploadBytes(imageRef, file);

      // Get the download URL
      const url = await getDownloadURL(imageRef);

      // Save the URL and some metadata to Realtime Database
      const imagesRef = dbRef(db.db, "markers/"+id+"/image"
      );
      
      await set(imagesRef, {
        url,
        name: file.name,
        createdAt: Date.now()
      });

      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload image.");
    }
    file = null;
    document.getElementById("fileInput").value = "";
    
  }
   function handleFileChange(e) {
    file = e.target.files[0];
  }
  function openModalPost(col){
    openPost = !openPost;
    markerColor= col;
  }
  function removeModal(){
    modalOpen=false;
    modalOpen=modalOpen;
    remove(ref(db.db,'markers/'+id))
    marker.remove()
  }
  function openModal(content,ide,col, mark){
    modalOpen=!modalOpen
    modalOpen=modalOpen
    modalContent=content
    id=ide
    color = col
    marker = mark;
    marker = marker;
    markerColor = marker.getElement().style.backgroundColor
    markerColor=markerColor;
    author = markerColor;
  } 
  function formatTimestamp(timestamp) {
        if (!timestamp) {
            return "No date available";
        }

        const dateObject = new Date(timestamp);
        
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true 
        };

        return dateObject.toLocaleString('en-US', options);
    }
  
  function filterMarkersByColor(selectedColor) {
    allMarkers.forEach(({ marker, color }) => {
      const el = marker.getElement();
      if (color === selectedColor || selectedColor === 'all') {
        el.style.display = 'block';
      } else {
        el.style.display = 'none';
      }
    });
  }
  onMount(async () => {
    
    await onValue(ref(db.db, 'markers/'), (snapshot) => {
      const data = snapshot.val()
      data2=data;
      data2=data2;
      let key = Object.keys(data)
      keys=key
      keys=keys
    });
     
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        currentlatitude = position.coords.latitude;
        currentlongitude = position.coords.longitude;
        console.log("Latitude:", currentlatitude, "Longitude:", currentlongitude);

        map = new maplibregl.Map({
          container: mapContainer,
          style: 'https://api.maptiler.com/maps/0199ca5b-cbe0-79a2-b4ef-d47e198081cf/style.json?key=GLcvFRENuNlnOWDeYOOi',
          center: [currentlongitude, currentlatitude],
          zoom: 12
        });
     

        const userMarker = new maplibregl.Marker({ color: "#00008B" })
          .setLngLat([currentlongitude, currentlatitude])
          .addTo(map);
        marker = userMarker;
        setupMapClickListener();
        onValue(ref(db.db, 'markers'), (snapshot) => {
            const data = snapshot.val();
            keys=Object.keys(data)
            data2=data
            data2=data2
            console.log(data2)
            console.log("keys: "+keys)
            
            keys=keys


            keys.forEach(key=>{
              const newMark = new maplibregl.Marker({color: data2[key]?.marker?.color})
                .setLngLat([data2[key]?.marker?.longitude, data2[key]?.marker?.latitude])
                .addTo(map);
              allMarkers.push({ marker, color: data2[key]?.marker?.color });
              const markerElement = newMark.getElement();
              markerElement.id = key;
          
              markerElement.addEventListener('click', (event) => {
                event.stopPropagation();
                const content = `Marker at [${data2[key]?.marker?.longitude.toFixed(4)}, ${data2[key]?.marker?.latitude.toFixed(4)}]`;
                openModal(content, markerElement.id, markerColor, newMark);
              });   
        })
        
        
        });
        console.log(keys)
        
        
        
      },
      (error) => {
        console.error("Error getting location:", error.message);

        map = new maplibregl.Map({
          container: mapContainer,
          style: 'hhttps://api.maptiler.com/maps/0199ca5b-cbe0-79a2-b4ef-d47e198081cf/style.json?key=GLcvFRENuNlnOWDeYOOi',
          center: [0, 0],
          zoom: 2
        });

        setupMapClickListener();
        onValue(ref(db.db, 'markers'), (snapshot) => {
            const data = snapshot.val();
            keys=Object.keys(data)
            data2=data
            data2=data2
            console.log(data2)
            console.log("keys: "+keys)
            
            keys=keys


            keys.forEach(key=>{
              const newMark = new maplibregl.Marker({color: data2[key]?.marker?.color})
                .setLngLat([data2[key]?.marker?.longitude, data2[key]?.marker?.latitude])
                .addTo(map);
              const markerElement = newMark.getElement();
              markerElement.id = key;
          
              markerElement.addEventListener('click', (event) => {
                event.stopPropagation();
                const content = `Marker at [${data2[key]?.marker?.longitude.toFixed(4)}, ${data2[key]?.marker?.latitude.toFixed(4)}]`;
                openModal(content, markerElement.id, markerColor, newMark);
              });   
        })
        });
        console.log(keys)
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  } 

  function setupMapClickListener() {
    

    
    map.on('click', async (e) => {
      if(markerColor !==''){
      const { lng, lat } = e.lngLat;
      openModalPost(markerColor);
      const newMarker = new maplibregl.Marker({ color: markerColor })
        .setLngLat([lng, lat])
        .addTo(map);
        
      newMarker.addClassName(markerColor);
      numMarkers += 1;
      const markerElement = newMarker.getElement();
      
      

      
      markers.push({ mark: newMarker, content: report, });
      const postListRef = ref(db.db, 'markers');
      const newPostRef = push(postListRef);
      const key = newPostRef.key;
      set(newPostRef, {
          marker: {
            color: markerColor,
            latitude: lat,
            longitude: lng,
            

          }
      });
      markerColor = "";
      markerColor=markerColor;
      markerElement.id = key;
      id=key;
      markerElement.addEventListener('click', (event) => {
        event.stopPropagation();
        const content = `Marker at [${lng.toFixed(4)}, ${lat.toFixed(4)}]`;
        openModal(content, markerElement.id, markerColor, newMarker);
      });   
    }});
   

  }
  
  return () => {
    if (map) map.remove();
  };
});

  
</script>

<Modal bind:showModal={modalOpen} >
  
  {#snippet header()}
      
		<div class = "post">
    <div class = 'postAuthor'>
      <img src = "../../default-Avata.png" style = "background:white;height:1em;width:auto;border-style:solid;border-color:white;border-width:5px;border-radius:3px;vertical-align: middle;">
      <span class="author-name">
        {data2[id]?.author}
      </span>
       <h1 style="color: {data2[id]?.marker?.color}; font-family:Comic Sans MS, Comic Sans, cursive;  font-size:large;border-width:3px; border-color:white;background-color:black;border-style:solid;border-radius:5px;display: inline-block;flex: 0 0 auto;padding:1px">
      
        {#if data2[id]?.marker?.color==="#00FFFF"}
          Disturbance
        {/if}
        {#if data2[id]?.marker?.color==="#FF69B4"}
          Event
        {/if}
        {#if data2[id]?.marker?.color==="#FF0000"}
          Crime
        {/if}
        
  
      </h1>
      <h1 class = "date">
      {formatTimestamp(data2[id]?.timestamp)}
    </h1>
 

    </div>
    
    <img src = "{data2[id]?.image?.url}" style = "position:left; min-width:20vw">
    <!-- <img src = "https://maps.googleapis.com/maps/api/streetview?size=600x400&location={data2[id]?.marker?.latitude},{data2[id]?.marker?.longitude}&fov=80&heading=70&pitch=0&key=API_KEY"> -->
    <div class = "descriptionBox">
   
    <h1 class = 'description'>
       {data2[id]?.description}
    </h1>
    </div>
   </div>
    
	{/snippet}
  <button style="width:80px; height:35px;" onclick={()=> removeModal()}>remove</button>

</Modal>

<Modal bind:showModal={openPost}>

<form  method="POST" action="?/login">
  <Input type="hidden" name="markerId" value={id} />
  <div class="mb-6 grid gap-6 md:grid-cols-2">
    <div>
      <Label for="first_name" class="mb-2">First name</Label>
      <Input name = 'firstName' type="text" id="first_name" placeholder={id} required />
    </div>
    <div>
      <Label for="last_name" class="mb-2">Last name</Label>
      <Input name = 'lastName' type="text" id="last_name" placeholder="Doe" required />
    </div>
  </div>
  <div class="mb-6">
    <Label for="email" class="mb-2">Email address</Label>
    <Input name = "email" type="email" id="email" placeholder="john.doe@company.com" required />
  </div>
  <div class="mb-6">
    <Label for="password" class="mb-2">Password</Label>
    <Input name = "password" type="password" id="password" placeholder="•••••••••" required />
  </div>
  <div class="mb-6">
    <Label for="confirm_password" class="mb-2">Confirm password</Label>
    <Input name = "confirmPassword" type="password" id="confirm_password" placeholder="•••••••••" required />
  </div>
  <div class="mb-6">
    <Label for="Title" class="mb-2">Title</Label>
    <Input name = "Title" type="text" id="Title" placeholder="Title" required />
  </div>
   <div class="mb-6">
    <Label for="Description" class="mb-2">Description</Label>
    <Input name = "Description" type="text" id="Description" placeholder="Description" required />
  </div>
 <input id="fileInput" type="file" onchange={handleFileChange}/>


  <Checkbox classes={{ div: "mb-6 gap-1 rtl:space-x-reverse" }} required>
    I agree with the <A href="/" class="text-primary-700 dark:text-primary-600 hover:underline">terms and conditions</A>.
  </Checkbox>
  <button onclick={()=> uploadImage()} formaction = "?/register">Submit</button>
</form>

  
</Modal> 
  <div  style="display:flex; justify-content: space-around;">

<Modal bind:showModal = {openSearch}>
  <button style="color:blueviolet;padding:2px;margin:10px 10px"
  > Disturbance </button>
  <button style="color:blueviolet;padding:2px;margin:10px 10px"> Event </button>
  <button style="color:blueviolet;padding:2px;margin:10px 10px"> Crime </button>
</Modal>
<button style="color:{markerColor === "#00FFFF" ? "#000000": "#00FFFF"};padding:2px;background-color:{markerColor==='#00FFFF' ? '#00FFFF' : 'black' }; margin:10px 10px"
onclick={() => (markerColor="#00FFFF")}> Disturbance </button>
<button style="color:{markerColor === "#FF69B4" ? "#000000": "#FF69B4"};padding:2px;background-color:{markerColor==='#FF69B4' ? '#FF69B4' : 'black' }; margin:10px 10px"
onclick={() => (markerColor="#FF69B4")}> Event </button>
<button style="color:{markerColor === "#FF0000" ? "#000000": "#FF0000"};padding:2px;background-color:{markerColor==='#FF0000' ? '#FF0000' : 'black' }; margin:10px 10px"
onclick={() => (markerColor="#FF0000")}> Crime </button>

<h1 style="color: dimgrey; font-family: sans-serif; font-size:large; text-align:right;">
  SMELL360
</h1>
</div>

<style>
  html, body, #svelte {
    height: 100%;
    margin: 0;
    padding: 0;
  }
  img{
    border-radius: 5%;
    max-width:100vw;
    max-height:50vh
  }
  .descriptionBox{
    background-color:rgb(72, 72, 72);
    border-radius:5px;
    /* display:flexbox; */
    flex-direction:grid;
    padding-left: 10px;
    border-style:solid;
    border-width:3px;
    border-color:white;
    
  }
  .post{
    max-height:100vh;
    padding:3px;
    display: block;
  }
  #mapWrapper {
    height: 100%;
  }
  .description{
    background-color:rgb(72, 72, 72);
    color:white;
    border-radius:3px;
    max-height:20vh;
    max-width:90vw
  }
  #map {
    width: 100vw;
    height: 100vh;
    border: 4px solid #333; 
    border-radius: 12px;  
    overflow:hidden
  }
  .add-break::after {
  content: "\A";
  white-space: pre;
}
  .date{
    padding:5px;
    color: white; 
    font-family: Comic Sans MS, Comic Sans, cursive; 
    font-size: medium;
    font-weight:bold;
    text-align:left;
    border-width:4px;
    border-color:white;
    border-radius:5px;
    padding-left: 5px;
    padding-right:5px;
    display:inline-block;
    }

button {
  border: 2px solid #333; 
  border-radius: 8px;
  padding:8px;
  background-color: rgb(0, 0, 0);
  cursor: pointer;
}
button:hover {
  background-color: rgb(108, 90, 90); 
}
h1{
  color:#0056b3;
  border-width:5px;
  border-color:white;
  padding:5;
  text-align:center;
}
.postAuthor{
  padding:5px;
  color: white; 
  font-family: Comic Sans MS, Comic Sans, cursive; 
  font-size:x-large;
  font-weight:bold;
  text-align:left;
  border-width:4px;
  border-color:white;
  border-radius:5px;
  padding-left: 5px;
  padding-right:5px;
  display:inline-block;

}
.author-name {
  text-decoration: underline; 
}


</style>
<div id="mapWrapper" style="height: 100%;padding:50">
  <div bind:this={mapContainer} id="map" style = "height:85vh; width:98vw"></div>
</div>