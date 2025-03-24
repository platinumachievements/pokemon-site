export async function onRequestGet({ request }) {
    const url = new URL(request.url);
    const name = url.searchParams.get('name');
    if (!name) return new Response('Missing name', { status: 400 });
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await response.json();
	console.log(data);
    return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
    });
}