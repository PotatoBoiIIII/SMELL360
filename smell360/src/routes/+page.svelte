  <script>
  import maplibregl from 'maplibre-gl';
  import { onMount } from 'svelte';
  import Modal from '../lib/Modal.svelte'
  import 'maplibre-gl/dist/maplibre-gl.css';
  import { Input, Label, Button, Checkbox, A } from "flowbite-svelte";
  import { getDatabase, ref, child, push, update, set,query,get,onValue, remove } from "firebase/database";  
  import db from '$lib/firebase.js'
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


  
  // let name = '';

  // openPost = false;

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
          style: 'https://api.maptiler.com/maps/0199ab53-2bc6-7d40-8832-7f940b951e80/style.json?key=F7nv5KBARzvXCzTOadTH',
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
        filterMarkersByColor('#000000')
        });
        console.log(keys)
        
        
        
      },
      (error) => {
        console.error("Error getting location:", error.message);

        map = new maplibregl.Map({
          container: mapContainer,
          style: 'https://api.maptiler.com/maps/0199ab53-2bc6-7d40-8832-7f940b951e80/style.json?key=F7nv5KBARzvXCzTOadTH',
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
      <img src = "https://maps.googleapis.com/maps/api/streetview?size=600x400&location={data2[id]?.marker?.latitude},{data2[id]?.marker?.longitude}&fov=80&heading=70&pitch=0&key=AIzaSyASmo2E3RcGT6wzLrt3ceXYUBVyv9SR2HU">
		
    <h1 style="color: dimgrey; font-family: 'Roboto'; font-size:larger;">
      Author: {data2[id]?.author}
 
    </h1>
    
    <h1 style="color: dimgrey; font-family: 'Roboto'; font-size:larger">
      Type:
      {#if data2[id]?.marker?.color==="#00FFFF"}
        Disturbance
      {/if}
      {#if data2[id]?.marker?.color==="#000000"}
        Event
      {/if}
      {#if data2[id]?.marker?.color==="#FF0000"}
        Crime
      {/if}
      
 
    </h1>
    <h1 style="color: dimgrey; font-family: 'Roboto'; font-size:large;">
      ID: {id}
 
    </h1>
     <h1>
      Title: {data2[id]?.title}
    </h1>
    <h1>
      Description: {data2[id]?.description}
    </h1>
   
    <button style="width:80px; height:35px;" onclick={()=> removeModal()}>remove</button>
	{/snippet}

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
    <div>
      <Label for="phone" class="mb-2">Phone number</Label>
      <Input type="tel" id="phone" placeholder="123-456-7890" pattern={"[0-9]{3}-[0-9]{3}-[0-9]{4}"} required />
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
  
  <Checkbox classes={{ div: "mb-6 gap-1 rtl:space-x-reverse" }} required>
    I agree with the <A href="/" class="text-primary-700 dark:text-primary-600 hover:underline">terms and conditions</A>.
  </Checkbox>
  <button formaction = "?/register">Submit</button>
</form>

  
</Modal> 
  <div  style="display:flex; justify-content: space-around;">

<Modal bind:showModal = {openSearch}>
  <button style="color:blueviolet;padding:2px;margin:10px 10px"
  > Disturbance </button>
  <button style="color:blueviolet;padding:2px;margin:10px 10px"> Event </button>
  <button style="color:blueviolet;padding:2px;margin:10px 10px"> Crime </button>
</Modal>
<button style="color:blueviolet;padding:2px;background-color:{markerColor==='#00FFFF' ? '#00FFFF' : 'honeydew' }; margin:10px 10px"
onclick={() => (markerColor="#00FFFF")}> Disturbance </button>
<button style="color:blueviolet;padding:2px;background-color:{markerColor==='#000000' ? '#000000' : 'honeydew' }; margin:10px 10px"
onclick={() => (markerColor="#000000")}> Event </button>
<button style="color:blueviolet;padding:2px;background-color:{markerColor==='#FF0000' ? '#FF0000' : 'honeydew' }; margin:10px 10px"
onclick={() => (markerColor="#FF0000")}> Crime </button>
<button style="color:blueviolet;padding:2px;background-color:{markerColor==='#0000FF' ? '#FF0000' : 'honeydew' }; margin:10px 10px"
onclick={() => (openSearch = true)}> Search for button</button>
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
  }
  .post{
    height:100vh;
  }
  #mapWrapper {
    height: 100%;
  }
  #map {
    width: 100vw;
    height: 100vh;
    border: 4px solid #333; 
    border-radius: 12px;  
    overflow:hidden
  }
  #maplibregl-marker {
  background-image: url('https://cdn.maptiler.com/maplibre-gl-js/v1.15.2/img/marker-icon.png');
  background-size: cover;
  width: 30px;
  height: 40px;
  cursor: pointer;
}
button {
  border: 2px solid #333; 
  border-radius: 8px;
  padding: 8px 16px;
  background-color: white;
  cursor: pointer;
}
button:hover {
  background-color: #ffffffff; 
}
h1{
  color:aqua;
}
#mapContainer{
  height:100%
}
h2{
  max-width: 100vw;
}

</style>
<div id="mapWrapper" style="height: 100%;padding:50">
  <div bind:this={mapContainer} id="map" style = "height:85vh; width:98vw"></div>
</div>