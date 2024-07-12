let addToy = false;
const toyUrl = "http://localhost:3000/toys"; 

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.getElementById("toy-collection");
  
  addBtn.addEventListener("click", () => {
    
    
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  
  fetchToys();

 
  const toyForm = document.querySelector(".add-toy-form");
  toyForm.addEventListener("submit", handleFormSubmit);
});


const fetchToys = () => {
  fetch(toyUrl)
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => {
        const toyCard = createToyCard(toy);
        document.getElementById("toy-collection").appendChild(toyCard);
      });
    })
    .catch(error => console.error('Error fetching toys:', error));
};


const createToyCard = (toy) => {
  const card = document.createElement('div');
  card.className = 'card';

  const toyName = document.createElement('h2');
  toyName.innerText = toy.name;

  const toyImage = document.createElement('img');
  toyImage.src = toy.image;
  toyImage.alt = toy.name;
  toyImage.className = 'toy-avatar';

  const toyLikes = document.createElement('p');
  toyLikes.innerText = `${toy.likes} Likes`;

  const likeButton = document.createElement('button');
  likeButton.className = 'like-btn';
  likeButton.id = toy.id; 
  likeButton.innerText = 'Like ❤️';
  likeButton.addEventListener('click', () => {
    toy.likes += 1; 
    toyLikes.innerText = `${toy.likes} Likes`; 
  });

  card.append(toyName, toyImage, toyLikes, likeButton);
  return card;
};



const handleFormSubmit = (event) => {
  event.preventDefault();

  const nameInput = event.target.elements.name;
  const imageInput = event.target.elements.image;

  const newToy = {
    name: nameInput.value,
    image: imageInput.value,
    likes: 0,
  };
  
  fetch(toyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newToy)
   })
  .then(response => response.json())
  .then(toy => {
    const toyCard = createToyCard(toy);
    document.getElementById("toy-collection").appendChild(toyCard);

    
    nameInput.value = '';
    imageInput.value = '';
    document.querySelector(".container").style.display = "none";
    addToy = false;
  })
  .catch(error => console.error('Error creating toy:', error));
};
const increaseLikes = (toy) => {
  const newLikes = toy.likes + 1; // Increment likes

  fetch(`${toyUrl}/${toy.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ likes: newLikes }), // Update the likes in the request body
  })
  .then(response => response.json())
  .then(updatedToy => {
    toy.likes = updatedToy.likes; // Update the local toy object
    const toyLikes = document.querySelector(`#${toy.id} + p`); // Select the corresponding <p> element
    toyLikes.innerText = `${toy.likes} Likes`; // Update likes text in the DOM
  })
  .catch(error => {
    console.error('Error updating likes:', error);
  });
};