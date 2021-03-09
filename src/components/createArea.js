import React, { useState } from 'react';
// JS
// const input = document.getElementById('myText');
// const inputValue = input.value
// React
// value, onChange
// dynamic object keys

const ControlledInputs = () => {
  const [data, setData] = useState({title:'',content:''});
 
  const [people, setPeople] = useState([]);
  const handleChange = (e) => {
    
    const name = e.target.name
    const value = e.target.value
    setData({ ...data, [name]: value })

  }
  const handleSubmit = (e) => {
    e.preventDefault();
   
    if (data.title && data.content) {
      const person = {...data, id: new Date().getTime().toString()};
      console.log(person);
      setPeople((people) => {
        return [...people, person];
      });
      setData({});
      
    } else {
      console.log('empty values');
    }
    
  };
  const removeData = (id) => {
    return setPeople(people.filter((person) => person.id !== id));
  }
  return (
    <>
      <article>
          <form className=' form note' onSubmit={handleSubmit}>
                  <div className=''>
                      <label htmlFor='title'>Title : </label>
                  <input
              type='text'
              id='title'
              name='title'
              value={data.title}
             onChange={handleChange}/>
         
        </div>
                  <div className=''>
                 <label htmlFor='content'>Content: </label>
            <textarea
              type='text'
              id='content'
              name='content'
              value={data.content}
                          onChange={handleChange} />
                      </div>
    <button type='submit' className='btn' >Submit</button>
      </form>
 
        {people.map((person, index) => {
          const { id, title, content} = person;
          return (
            <div className='note' key={id}>
              <h1>{title}</h1>
              <p>{content}</p>
              <button type='submit' className='btn'
              onClick={()=>removeData(id)}
              
              >Remove</button>
            </div>
          );
        })}
      </article>
    </>
  );
};

export default ControlledInputs;
