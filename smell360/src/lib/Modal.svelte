<script>
	let { showModal = $bindable(), header, children } = $props();

	let dialog = $state(); // HTMLDialogElement

	$effect(() => {
	if (showModal && !dialog.open) {
		dialog.showModal();
	} else if (!showModal && dialog.open) {
		dialog.close();
	}
});

</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialog}
	onclose={() => (showModal = false)}
	onclick={(e) => { if (e.target === dialog) dialog.close(); }}
>
	<div style="height: 80vh; width:50vw;">
		{@render header?.()}
		<hr />
		{@render children?.()}
		<hr />
		<button autofocus onclick={() => dialog.close()}>close modal</button>
	</div>
</dialog>

<style>
  :global(dialog) {
    max-width: 100em;
    width: 50vw;
    border-radius: 0.2em;
    border: none;
    padding: 30px;
    background: black;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #333;
	overflow-x:hidden;
	scrollbar-width: none;
  }
  
	:global(dialog)::-webkit-scrollbar {
  		display: none; /* Chrome, Safari, Edge */
	}
  :global(dialog::backdrop) {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    animation: fade 0.2s ease-out;
  }
  :global(dialog > div) {
    padding: 1.5em;
    background: #000000;
    border-radius: 0.2em;
    box-sizing: border-box;
  }
  :global(button) {
    display: block;
    margin: 1em auto 0 auto;
    padding: 0.5em 1.2em;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 0.3em;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s ease;
  }
  :global(button:hover) {
    background-color: #0056b3;
  }
  @media (max-width: 600px) {
    :global(dialog) {
      width: 90vw;
      padding: 20px;
    }
  }
</style>
