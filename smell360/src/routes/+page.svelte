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
  let openSearch = $state(false);
  let markers = [
    
  ];
  let id = $state("");
  let keys = $state()



  
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
  
  
  onMount(async () => {
    
    await onValue(ref(db.db, 'markers'), (snapshot) => {
      const data = snapshot.val();
      keys=Object.keys(data)
      data2=data
      data2=data2
      console.log(data2)
      console.log("keys: "+keys)
      
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
          style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=F7nv5KBARzvXCzTOadTH',
          center: [currentlongitude, currentlatitude],
          zoom: 12
        });

        const userMarker = new maplibregl.Marker({ color: "#00008B" })
          .setLngLat([currentlongitude, currentlatitude])
          .addTo(map);
        marker = userMarker;
        setupMapClickListener();
        console.log(keys)
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
        
      },
      (error) => {
        console.error("Error getting location:", error.message);

        map = new maplibregl.Map({
          container: mapContainer,
          style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=F7nv5KBARzvXCzTOadTH',
          center: [0, 0],
          zoom: 2
        });

        setupMapClickListener();
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  } else {
    console.error("Geolocation not available");

    map = new maplibregl.Map({
      container: mapContainer,
      style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=F7nv5KBARzvXCzTOadTH',
      center: [0, 0],
      zoom: 2
    });

    setupMapClickListener();
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
          color:"color3",
          marker: {
            color: markerColor,
            latitude: lat,
            longitude: lng,

          }
      });
      markerColor = "";
      markerColor=markerColor;
      markerElement.id = key;
      
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

<Modal bind:showModal={modalOpen}>
  
  {#snippet header()}
		<h2>
			{modalContent} color: {JSON.stringify(data2[id])}
		</h2>
    <h1 style="color: dimgrey; font-family: 'Roboto'; font-size:larger;">
      Author: 
 
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
    <button style="width:80px; height:35px;" onclick={()=> removeModal()}>remove</button>
	{/snippet}

</Modal>
{#if form?.success}
  <p>{form?.message}</p>
{/if}
<Modal bind:showModal={openPost}>

<form  method="POST" action="?/login">
  <div class="mb-6 grid gap-6 md:grid-cols-2">
    <div>
      <Label for="first_name" class="mb-2">First name</Label>
      <Input name = 'firstName' type="text" id="first_name" placeholder="John" required />
    </div>
    <div>
      <Label for="last_name" class="mb-2">Last name</Label>
      <Input name = 'lastName' type="text" id="last_name" placeholder="Doe" required />
    </div>
    <div>
      <Label for="phone" class="mb-2">Phone number</Label>
      <Input type="tel" id="phone" placeholder="123-45-678" pattern={"[0-9]{3}-[0-9]{2}-[0-9]{3}"} required />
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
  #map {
    width: 100%;
    height: 800px;
    border: 4px solid #333; 
    border-radius: 12px;  
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

</style>

<div bind:this={mapContainer} id="map"></div>
