import { useEffect, useState } from "react";

type Creature = {
  id: number;
  name: string;
};

const API_URL = 'http://localhost:4321/api';

export default function App() {
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCreatures, setTotalCreatures] = useState(0);

  const loadCreatures = async () => {
    const response = await fetch(`${API_URL}/pokemon.json?page=${currentPage}`);
    const data = await response.json();
    setCreatures(data.list);
    setTotalCreatures(data.count);
  };

  useEffect(() => {
    loadCreatures();
  }, [currentPage]);

  const createCreature = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const creature = {
      id: parseInt(formData.get('id') as string),
      name: formData.get('name') as string,
    };

    await fetch(`${API_URL}/pokemon.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(creature),
    });

    form.reset();
    if (currentPage === Math.ceil(totalCreatures / 5) && creatures.length < 5) {
      setCreatures((current) => [...current, creature]);
    }
    setTotalCreatures((current) => current + 1);
  };

  const removeCreature = async (id: number) => {
    await fetch(`${API_URL}/pokemon/${id}.json`, {
      method: 'DELETE',
    });

    setCreatures((current) => current.filter((creature) => creature.id !== id));
    setTotalCreatures((current) => current - 1);

    if (currentPage > Math.ceil((totalCreatures - 1) / 5)) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <main className="container mx-auto flex flex-col">
      <h1 className="text-5xl text-red-600 font-extrabold text-center">Pokedex</h1>
      <form action="/api/pokemon" method="post" onSubmit={createCreature}>
        <h2 className="text-2xl text-red-700 font-bold">Agregar nuevo pokemon</h2>
        <input type="number" name="id" placeholder="ID" className="my-1 w-full p-2 border border-gray-300 rounded-lg" />
        <input type="text" name="name" placeholder="Name" className="my-1 w-full p-2 border border-gray-300 rounded-lg" />
        <button type="submit" className="w-full p-2 bg-red-600 text-white rounded-lg mt-2 font-bold uppercase duration-200 hover:bg-red-700">Agregar</button>
      </form>
      <ul className="mt-4 border-4 border-red-700">
        <li className="flex items-center justify-between border-b border-gray-300 p-2 bg-red-700">
          <span className="text-lg text-white font-extrabold w-1/3">ID</span>
          <span className="text-lg text-white font-extrabold w-1/3 text-center">Name</span>
          <span className="text-lg text-white font-extrabold w-1/3 text-right">DELETE</span>
        </li>
        {creatures.map(creature => (
          <li className="flex items-center justify-between border-b border-gray-300 p-2">
            <span className="text-lg text-red-600 font-bold w-1/3">{creature.id}</span>
            <span className="text-lg text-red-600 font-bold w-1/3 text-center">{creature.name}</span>
            <div className="w-1/3 text-right">
              <button onClick={() => removeCreature(creature.id)} className="font-bold hover:font-extrabold">X</button>  
            </div>
          </li>
        ))}
      </ul>
      <div className="flex justify-center gap-2">
        <button onClick={() => setCurrentPage(c => Math.max(1, c - 1))} disabled={currentPage === 1} className="p-2 bg-red-600 text-white rounded-lg mt-2 font-bold uppercase duration-200 disabled:opacity-50 hover:bg-red-700">Prev</button>
        <span className="flex items-center self-stretch">{currentPage}</span>
        <button onClick={() => setCurrentPage(c => Math.min(Math.ceil(totalCreatures / 5), c + 1))} disabled={currentPage === Math.ceil(totalCreatures / 5)} className="p-2 bg-red-600 text-white rounded-lg mt-2 font-bold uppercase duration-200 disabled:opacity-50 hover:bg-red-700">Next</button>
      </div>
    </main>
  );
}