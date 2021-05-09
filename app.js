window.onload = () => {
	let search_results = [];
	let filtered_results = [];

	// FETCHES API DATA
	const get_data = () => {
		fetch ('./seed.js')

		.then(resp => resp.json())

		.then((response) => {
			generate_view(response.restaurants);
			fuzzy_search();			
			sort_restaurants();
			filter_by_type();
			mark_favorite();
		})
	}

	// CREATES / GETS INIDIVIDUAL CARD
	const generate_view = (data) => {
		// HIDE ALL THE CARDS INITIALLY
		const cards_wrapper = [].slice.call(document.getElementById('cards_wrapper').children);
		cards_wrapper.forEach(el => el.style.display = 'none');		

		// CLEAR OUR FILTERTED RESULTS
		filtered_results = [];

		// CREATE CARDS
		data.forEach((el, idx) => {
			// IF JSON
			if (el.id) {
				create_card(el, idx);
			}

			// IF HTML ELEMENTS
			else {
				document.getElementById('cards_wrapper').append(el);
				el.style.display = 'initial';				
			}
		});

	}

	// CREATES THE HTML FOR EACH INDIVIDUAL CARD
	const create_card = (rest, num) => {
		// CREATE CARD ELELEMNTS
		const card = document.createElement('ASIDE');
		const rest_name = document.createElement('P');
		const rest_add = document.createElement('P');
		const rest_type = document.createElement('P');
		const rest_rev_count = document.createElement('P');
		const rest_fav = document.createElement('BUTTON');

		// CREATE DATA
		rest_name.append(rest.name);
		rest_add.append(rest.address);
		rest_type.append(rest.cuisine_type);
		rest_rev_count.append(rest.reviews.length);
		rest_fav.append('Mark Favorite');

		// APPEND TEXT NODE TO CARD
		card.append(rest_name);
		card.append(rest_add);
		card.append('Number of reviews: ', rest_rev_count);
		card.append(rest_type);
		card.append(rest_fav);

		// APPEND CARD TO DOM
		card.classList.add('card');
		card.setAttribute('data-type', rest.cuisine_type); // ADD DATA ATTRIBUTE
		card.setAttribute('data-name', rest.name); // ADD DATA ATTRIBUTE		
		card.setAttribute('data-id', num++); // INDIVIDUAL CARD ID
		cards_wrapper.append(card);	
	}

	// FUZZY SEARCH FOR RESTAURANTS
	const fuzzy_search = () => {
		const search_rests = document.getElementById('search_rests');

		let search_term;

		search_rests.addEventListener('keyup', function(event) {
			search_term = event.target.value;

			// CLEAR PREVIOUS SEARCH RESULTS
			search_results = [];

			const cards_wrapper = [].slice.call(document.getElementById('cards_wrapper').children);

			// SEARCH BY NAME OR TYPE
			cards_wrapper.map((el, idx) => {
				if (el.dataset.name.toLowerCase().includes(search_term)) {
					search_results.push(el);
				}

				else if (el.dataset.type.toLowerCase().includes(search_term)) {
					search_results.push(el);
				}
			});

			generate_view(search_results);
		});
	}

	// SORT RESTURANTS
	const sort_restaurants = () => {
		const sort_btn = document.getElementById('sort_rests');

		sort_btn.addEventListener('click', function(event) {
			event.preventDefault();

			const cards_wrapper = [].slice.call(document.getElementById('cards_wrapper').children);

			// SORT BY NAMES ALPHABETICALLY ON ALL CARDS
			let sorted = cards_wrapper.sort((a, b) => (a.dataset.name > b.dataset.name) ? 1 : -1);
			generate_view(sorted);

		});
	}

	// FILTER BY TYPE
	const filter_by_type = () => {
		const type_dd = document.getElementById('filter_by_type');
		const cards_wrapper = [].slice.call(document.getElementById('cards_wrapper').children);

		type_dd.addEventListener('change', function(e) {
			let selected_type = e.target.value;

			cards_wrapper.forEach((el) => {
				if (selected_type.localeCompare(el.dataset.type) == 0) {
					filtered_results.push(el);
				}
			});
			generate_view(filtered_results);
		});

	}

	// MARK FAVORITE
	const mark_favorite = () => {
		let fav_btn = document.querySelectorAll('aside.card button');
		fav_btn.forEach(el => {
			el.addEventListener('click', function(event) {
				event.preventDefault();								
				
				const rest_id = JSON.stringify(this.parentNode.dataset.id);		

				// IF REST ID DOESNT EXIST, SET TO TRUE
				if (!localStorage.getItem(rest_id)) {
					localStorage.setItem(rest_id, true);
					this.innerHTML = 'Unmark Favorite';
					console.log(localStorage);								
				}				
				// IF REST ID DOES EXIST INSIDE LOCAL STORAGE, CHECK BOOLEAN
				else {
					Object.keys(localStorage).forEach((el) => {					
						if (rest_id.localeCompare(el) == 0 && localStorage.getItem(rest_id) === 'true') {
							localStorage.setItem(rest_id, false);
							this.innerHTML = 'Mark Favorite';
							console.log(localStorage);
						}
						else if (rest_id.localeCompare(el) == 0 && localStorage.getItem(rest_id) === 'false') {
							localStorage.setItem(rest_id, true);
							this.innerHTML = 'Unmark Favorite';
							console.log(localStorage);
						}
					});					
				}
			});
		});
		// localStorage.clear();
	}

	get_data();
}