<script>
  import maplibregl from 'maplibre-gl';
  import { onMount } from 'svelte';
  import Modal from '../lib/Modal.svelte'
  import 'maplibre-gl/dist/maplibre-gl.css';  
  /** @type {import('./$types').PageProps} */
	let { data } = $props();

  let map;
  let mapContainer;
  let modalOpen = $state(false)
  let modalContent = $state('');
  let markerColor = $state('');
  let numMarkers = 0;
  let color = $state('');
  let openPost = $state(false);
  let marker = null;
  let author = '';
  let report =$state('');
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

      numMarkers += 1;
      const markerElement = newMarker.getElement();
      markerElement.id = numMarkers.toString();
      

      
      markers.push({ mark: newMarker, content: report, });
      
      markerElement.addEventListener('click', (event) => {
        event.stopPropagation();
        const content = `Marker at [${lng.toFixed(4)}, ${lat.toFixed(4)}]`;
        openModal(content, markerElement.id, markerColor, newMarker);
      });   
    }});
    markerColor = "";
  }

  return () => {
    if (map) map.remove();
  };
});

  
</script>

<Modal bind:showModal={modalOpen}>
  {#snippet header()}
		<h2>
			{modalContent} color: {color}
		</h2>
    <h1 style="color: dimgrey; font-family: sans-serif; font-size:larger;">
      Author:
 
    </h1>
    <h1 style="color: dimgrey; font-family: sans-serif; font-size:larger">
      Description: {report}
 
    </h1>
    <h1 style="color: dimgrey; font-family: sans-serif; font-size:larger">
      Type:
      {#if markerColor==="#00FFFF"}
        disturbance
      {/if}
      {#if markerColor==="#000000"}
        event
      {/if}
      {#if markerColor==="#FF0000"}
        crime
      {/if}
 
    </h1>
    <h1 style="color: dimgrey; font-family: sans-serif; font-size:large;">
      ID: {id}
 
    </h1>
    <button style="width:80px; height:35px;" onclick={()=> removeModal()}>remove</button>
	{/snippet}

</Modal>
<Modal bind:showModal={openPost}>
  {#snippet header()}
	 <input type="text" bind:value={report} />
	{/snippet}
  
</Modal>

<div  style="display:flex; justify-content: space-around;">


<button style="color:blueviolet;padding:2px;background-color:{markerColor==='#00FFFF' ? '#00FFFF' : 'honeydew' }; margin:10px 10px"
onclick={() => (markerColor="#00FFFF")}> disturbance </button>
<button style="color:blueviolet;padding:2px;background-color:{markerColor==='#000000' ? '#000000' : 'honeydew' }; margin:10px 10px"
onclick={() => (markerColor="#000000")}> event </button>
<button style="color:blueviolet;padding:2px;background-color:{markerColor==='#FF0000' ? '#FF0000' : 'honeydew' }; margin:10px 10px"
onclick={() => (markerColor="#FF0000")}> crime </button>
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
  font:bold
}

</style>

<div bind:this={mapContainer} id="map"></div>
