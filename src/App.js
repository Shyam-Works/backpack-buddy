import { useState } from "react";

const initialItems = [
  { id: 1, description: "Passports", quantity: 2, packed: true },
  { id: 2, description: "Socks", quantity: 12, packed: false },
  { id: 3, description: "Charger", quantity: 2, packed: false },
];

export default function App() {
  // here bcz if we put this in form we can not access this or render Items on Packing List
  const [items, setItems] = useState([]); // no item at the beginning.

  function handleAddItems(item){
    // add new item to the old items array. 
    // we can not use push bcz it generate new array and in React is not accepted.
    setItems((items)=>[...items, item]);
  }

  function handleDeleteItem(id){
    setItems(items=> items.filter(item=> item.id !== id));
  }

  function handleToggle(id){

    setItems( (items)=> items.map( (item) => item.id === id ? {...item, packed: !item.packed}: item));
  }

  function DeleteWholeList(){
    if(items.length === 0)
      window.confirm("you don't have anything please add items in your list📃!!");
    else{
      const confirmed = window.confirm('Are you sure😱? You want to delete travel list?')
    setItems([]);}
  }

  return(
    <div className="app">
      <Logo/>
      <Form onAddItems = {handleAddItems}/> 
      <PackingList items={items} onDeleteItem={handleDeleteItem} onToggle={handleToggle} onDeleteWholeList={DeleteWholeList}/>
      <Stats items={items}/>
    </div>
  );
}


function Logo(){
  return (
    <div>
      <h1>🌴Bagpack buddy💼</h1>
      <h6>Never leave anything behind!!</h6>
    </div>
  );
}

function Form({onAddItems}){

  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e){
    e.preventDefault();
  
  if(!description) return;
  const newItem = {description, quantity, packed: false, id: Date.now()}
  console.log(newItem);
 
  onAddItems(newItem);

  setDescription("");
  setQuantity(1);
  }
  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your 😍 trip?</h3>

      {/* select quantity */}
      <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>
        {/* dynamic 1-20 */}
        {Array.from({length : 20 } , (_,i)=> i + 1).map((num=> 
        <option value={num} key={num}>
          {num}
        </option>
        ))}
      </select>

      {/* enter description */}
      <input type="text" 
        placeholder="Item..." 
        value={description} 
        // when we type anything for onChange
        onChange={(e)=>
        setDescription(e.target.value)}>
      </input>

      <button>Add</button>
    </form>
  );
}
function PackingList({items, onDeleteItem, onToggle, onDeleteWholeList}){

  
  const [sortBy, setSortBy] = useState('packed')

  let sortedItems;
  if(sortBy === 'input') sortedItems = items;
  if(sortBy === 'description')
    sortedItems = items.slice().sort((a,b)=> a.description.localeCompare(b.description));
  if(sortBy === 'packed')
    sortedItems = items.slice().sort((a,b)=> Number(a.packed) - Number(b.packed));
  return (

    <div className="list">
    <ul>
      {sortedItems.map( (item)=> (
        // props
        <Item 
        item = {item}  
        key={item.id} 
        onDeleteItem={onDeleteItem}
        onToggle = {onToggle}
        />
        ))}
    </ul>

    <div className="actions">
        <select value={sortBy} onChange={(e)=> setSortBy(e.target.value)}>
          <option value = "input">
            Sort by input order
          </option>
          <option value= "description">
            Sort by description (A-Z)
          </option>
          <option value= "packed">
            Sort by packed status
          </option>
        </select>
        <button onClick={onDeleteWholeList}>Clear list</button>
    </div>
    </div>
  );
}

function Item({item, onDeleteItem, onToggle}){
  return(
    <li>
      
      <input type="checkbox" value={item.packed} onChange={()=>onToggle(item.id)}/>
      <span style={item.packed ? {textDecoration :  "line-through"  } : {} }>
      {item.quantity}
       <span> </span> {/*for space */}
      {item.description}
      </span>
      <button onClick={()=> onDeleteItem(item.id)}>❌</button>
    </li>
  );
}

function Stats({items}){

  if(!items.length){
    return (
      <p className="stats">
        <em>Let's start adding some items 🚀</em>
      </p>
    );
  }

  const numItems = items.length;
  const numPacked = items.filter(item=> item.packed).length;
  const percentage = Math.round((numPacked/ numItems ) * 100);

  return(
    <footer className="stats">
      <em>
        {percentage === 100 ? "You have everything ready to go ✈️" : 
        `💼 You have ${numItems} items on your list, and you have packed ${numPacked} (%${percentage})`
        }</em>
    </footer>
  );
}