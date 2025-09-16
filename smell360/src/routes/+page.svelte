<script>
  import maplibregl from 'maplibre-gl';
  import { onMount } from 'svelte';
  import Modal from '../lib/Modal.svelte'
  import 'maplibre-gl/dist/maplibre-gl.css';  
  let map;
  let mapContainer;
  let modalOpen = $state(false)
  let modalContent = $state('');
  let markerColor = $state('#000000');
  let numMarkers = 0;
  let color = $state('');
  let openPost = $state(false);
  let marker = null;
  let author = '';
  let report = '';
  let currentlongitude;
  let currentlatitude;
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
    modalOpen=!modalOpen;
    modalOpen=modalOpen;
    modalContent=content;
    id=ide;
    color = col
    marker = mark;
  } 
  let markers = [
    
  ];
  let id = $state(0);



  onMount(() => {


    navigator.geolocation.getCurrentPosition(
  (position) => {
    // Success callback: position object contains latitude, longitude, and other details
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    currentlongitude=longitude;
    currentlatitude=latitude;
    console.log("Latitude:", latitude, "Longitude:", longitude);
    map = new maplibregl.Map({
      container: mapContainer, // container id or element
      style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=F7nv5KBARzvXCzTOadTH', // basic open style
      center: [currentlongitude, currentlatitude], // starting position [lng, lat]
      zoom: 12 // starting zoom
    });
    marker = new maplibregl.Marker({color:"#00008B"})
      .setLngLat([currentlongitude, currentlatitude])
      .addTo(map);
  },
  (error) => {
    // Error callback: handle permission denials or other errors
    console.error("Error getting location:", error.message);
  },
  {
    // Optional options object
    enableHighAccuracy: true, // Request more accurate results
    timeout: 5000, // Maximum time to wait for a position (in milliseconds)
    maximumAge: 0, // Don't use cached positions
  }
);


    map = new maplibregl.Map({
      container: mapContainer, // container id or element
      style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=F7nv5KBARzvXCzTOadTH', // basic open style
      center: [0, 0], // starting position [lng, lat]
      zoom: 2 // starting zoom
    });
    
     map.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      openModalPost(markerColor);
      const marker = new maplibregl.Marker({color:markerColor})
        .setLngLat([lng, lat])
        .addTo(map);
      const mcolor = markerColor;
      
      numMarkers+=1
      const markerElement = marker.getElement();
      markerElement.id=numMarkers.toString();
      markers.push({mark: marker,lng:lng,lat:lat})
      markerElement.addEventListener('click', (event) => {
      event.stopPropagation();
      const content = `Marker at [${lng.toFixed(4)}, ${lat.toFixed(4)}]`;
      
      openModal( content, markerElement.id,mcolor, marker);
    });
    });

    return () => {
      map.remove(); // cleanup on component destroy
    };
  });
  
</script>
<Modal bind:showModal={modalOpen}>
  {#snippet header()}
		<h2>
			{modalContent} color: {color}
		</h2>
    <h1 style="color: dimgrey; font-family: sans-serif;">
      Author:
 
    </h1>
    <h1 style="color: dimgrey; font-family: sans-serif;">
      Description: {report}
 
    </h1>
    <h1 style="color: dimgrey; font-family: sans-serif;">
      Type: 
      {#if color==="#00FFFF"}
        disturbance
      {/if}
      {#if color==="#000000"}
        event
      {/if}
      {#if color==="#FF0000"}
        crime
      {/if}
 
    </h1>
    <h1 style="color: dimgrey; font-family: sans-serif;">
      ID: {id}
 
    </h1>
    <button onclick={()=> removeModal()}>remove</button>
	{/snippet}

</Modal>
<Modal bind:showModal={openPost}>
  {#snippet header()}
	 <input type="text" bind:value={report} />
	{/snippet}
  
</Modal>
<button style="background-color:honeydew;color:blueviolet;padding:2px;"
onclick={() => (markerColor="#00FFFF")}> disturbance </button>
<button style="background-color:honeydew;color:blueviolet;padding:2px;"
onclick={() => (markerColor="#000000")}> event </button>
<button style="background-color:honeydew;color:blueviolet;padding:2px;"
onclick={() => (markerColor="#FF0000")}> crime </button>

<style>
  #map {
    width: 100%;
    height: 800px;
  }
  #maplibregl-marker {
  background-image: url('https://cdn.maptiler.com/maplibre-gl-js/v1.15.2/img/marker-icon.png');
  background-size: cover;
  width: 30px;
  height: 40px;
  cursor: pointer;
}
h1{
  color:aqua;
  font:bold
}

</style>

<div bind:this={mapContainer} id="map"></div>
