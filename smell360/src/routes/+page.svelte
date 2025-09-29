<script>
  import maplibregl from 'maplibre-gl';
  import { onMount } from 'svelte';
  import Modal from '../lib/Modal.svelte'
  import 'maplibre-gl/dist/maplibre-gl.css';
  import { Input, Label, Button, Checkbox, A } from "flowbite-svelte";  
  /** @type {import('./$types').PageProps} */
	let { data, form } = $props();
  let map;
  let mapContainer;
  let modalOpen = $state(false)
  let modalContent = $state('');
  let markerColor = $state('');
  let numMarkers = 0;
  let color = $state('');
  let openPost = $state(false);
  let marker = null;
  let author = $state('');
  let report =$state('');
  let currentlongitude;
  let currentlatitude;
  let openSearch = $state(false);
  // let name = '';

  // openPost = false;

  function openModalPost(col){
    openPost = !openPost;
    markerColor= col;
  }
  function removeModal(){
    modalOpen=false;
    modalOpen=modalOpen;
    marker.remove()
  }
  function openModal(content,ide,col, mark){
    modalOpen=!modalOpen
    modalOpen=modalOpen
    modalContent=content
    id=ide
    color = col
    marker = mark
    markerColor = marker.getElement().style.backgroundColor
    markerColor=markerColor;
    author = markerColor;
  } 
  let markers = [
    
  ];
  let id = $state(0);
  
  onMount(() => {
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
    

    
    map.on('click', (e) => {
      if(markerColor !==''){
      const { lng, lat } = e.lngLat;
      openModalPost(markerColor);
      const newMarker = new maplibregl.Marker({ color: markerColor })
        .setLngLat([lng, lat])
        .addTo(map);
        
      newMarker.addClassName(markerColor);
      numMarkers += 1;
      const markerElement = newMarker.getElement();
      markerElement.id = numMarkers.toString();
      markerColor = "";
      markerColor=markerColor;

      
      markers.push({ mark: newMarker, content: report, });
      
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
			{modalContent} color: {color} {author}
		</h2>
    <h1 style="color: dimgrey; font-family: 'Roboto'; font-size:larger;">
      Author:
 
    </h1>
    
    <h1 style="color: dimgrey; font-family: 'Roboto'; font-size:larger">
      Type:
      {#if markerColor==="rgba(0, 0, 0, 0)"}
        Disturbance
      {/if}
      {#if markerColor==="#000000"}
        Event
      {/if}
      {#if markerColor==="#FF0000"}
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

<form>
  <div class="mb-6 grid gap-6 md:grid-cols-2">
    <div>
      <Label for="first_name" class="mb-2">First name</Label>
      <Input type="text" id="first_name" placeholder="John" required />
    </div>
    <div>
      <Label for="last_name" class="mb-2">Last name</Label>
      <Input type="text" id="last_name" placeholder="Doe" required bind:value={author} />
    </div>
    <div>
      <Label for="phone" class="mb-2">Phone number</Label>
      <Input type="tel" id="phone" placeholder="123-45-678" pattern={"[0-9]{3}-[0-9]{2}-[0-9]{3}"} required />
    </div>
  </div>
  <div class="mb-6">
    <Label for="email" class="mb-2">Email address</Label>
    <Input type="email" id="email" placeholder="john.doe@company.com" required />
  </div>
  <div class="mb-6">
    <Label for="password" class="mb-2">Password</Label>
    <Input type="password" id="password" placeholder="•••••••••" required />
  </div>
  <div class="mb-6">
    <Label for="confirm_password" class="mb-2">Confirm password</Label>
    <Input type="password" id="confirm_password" placeholder="•••••••••" required />
  </div>
  <Checkbox classes={{ div: "mb-6 gap-1 rtl:space-x-reverse" }} required>
    I agree with the <A href="/" class="text-primary-700 dark:text-primary-600 hover:underline">terms and conditions</A>.
  </Checkbox>
  <Button type="submit">Submit</Button>
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
  border: 2px solid #333;   /* thickness, style, and color */
  border-radius: 8px;       /* optional rounded corners */
  padding: 8px 16px;        /* spacing inside */
  background-color: white;  /* keep background clean */
  cursor: pointer;          /* pointer on hover */
}
button:hover {
  background-color: #ffffffff; /* subtle hover effect */
}
h1{
  color:aqua;
}

</style>

<div bind:this={mapContainer} id="map"></div>
