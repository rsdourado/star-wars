fetch('https://swapi.co/api/')
  .then(resp => resp.json())
  .then(data => {

    let urls = [];
    let assets = [];

    Object.entries(data).forEach(entry => {
      // Gets all the assets available in the API and displayes on the page
      let key = entry[0];
      let value = entry[1];
      let item = document.createElement("li");
      item.innerHTML = `${key}: <a href="${value}" target="_blank">${value}</a>`;
      document.getElementById("assets").appendChild(item);

      // creates a new list for each of the types of assets
      let list = document.createElement("div");
      list.innerHTML = `<h1>Star War's ${key}</h1><ol id=${key}></ol>`;
      document.getElementById("wrapper").appendChild(list);

      // add each asset's url and name to an array
      urls.push('https://swapi.co/api/' + key + '/');
      assets.push(key);
    });

    // combine the urls and assets arrays in an object, to be returned by the fucntion
    // in the end, I could just have returned the urls as an array, but I'm going to leave this here, because it is good to know

    let assetsObj = {};

    for (let i = 0; i < assets.length; i++) {
      assetsObj[assets[i]] = urls[i];
    }

    return assetsObj;

  })
  .then(assetsObj => {

    // convert the object into two arrays
    let assets = Object.keys(assetsObj); // in the end, this is useless, but i'm going to leave this here, because it is good to know
    let urls = Object.values(assetsObj);

    // get the name or title of all assets from the API, and display them in their respective places, in order
    const getData = async function () {

      // fetch all of the assets
      const arrayOfPromises = urls.map(url => fetch(url));

      // loop for each type of asset
      for await (let request of arrayOfPromises) {
        const data = await request.json(); // convert json
        const pages = Math.ceil(data.count / 10); // calculates the amount of pages each asset type has
        // get the url of the particular asset type 
        let url = data.next ? data.next.slice(0, -1) : 'https://swapi.co/api/films/?page='; // the film json doesn't have a next key where I can get the url from
        let urlsWithPages = []; // will be used later to display the data in the respective place
        let posLastDash = url.lastIndexOf("/");
        let asset = url.substring(21, posLastDash); // this is to find the correct id later

        // populates the array with the url of all the pages
        for (let i = 1; i <= pages; i++) {
          urlsWithPages.push(url + i);
        }

        // display the items from each page of assets in order
        const arrayOfPromises2 = urlsWithPages.map(url => fetch(url));

        // executes each step of the loop only after the last one finished
        for await (let request2 of arrayOfPromises2) {
          const data2 = await request2.json();
          data2.results.forEach(entry => {
              let person = entry.name === undefined ? entry.title : entry.name;
              let item = document.createElement("li");
              let node = document.createTextNode(person);
              item.appendChild(node);
              document.getElementById(asset).appendChild(item);
            }
          );
        }
      }
    }
    getData();

  });