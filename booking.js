jQuery(function ($) {
    $.ajax({
        url: "data.json",
        success: handleRequest

    })

    // set todays date 
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + "-" + (month) + "-" + (day);

    $('#checkin').val(today);

    $('#checkin').attr('min', today);
    $('#checkout').val($('#checkin').val());
    $('#checkin').change(function () {
        $('#checkout').val($('#checkin').val());
        $('#checkout').attr('min', ($('#checkin').val()));

    })
    let data = [];
    //handle the data from json
    function handleRequest(hotelData) {
        console.log(hotelData);

        const entries = hotelData.map(function (data) {
            return data.entries;

        });
        const roomTypes = hotelData.map(function (data) {
            return data.roomtypes;
        });

        const details = [...entries[1]];
        data = [...entries[1]];

        console.log(details);

        // Create an array with the filters required

        const allFiltersRequired = details.map(function (entry) {

            return entry.filters;
        })
        console.log(allFiltersRequired);
        let filteredArray = [];
        let finalFilteredArray = [];

        allFiltersRequired.forEach(function (filter) {

            filteredArray = filter.map(function (filts) {

                return filts.name;
            })

            filteredArray.forEach(function (filts) {
                finalFilteredArray.push(filts);

            })
        });

        finalFilteredArray = duplicateReject(finalFilteredArray);
        console.log(finalFilteredArray);

        const selectRecommendation = document.querySelector("#recommendation");
        console.log(selectRecommendation);
        finalFilteredArray.forEach(function (filter) {
            const opt = document.createElement('option');

            opt.appendChild(document.createTextNode(filter))
            opt.value = filter;
            selectRecommendation.appendChild(opt);
            console.log();
        })






        const cities = details.map(function (entry) {
            console.log(entry.city)
            return entry.city;
        })

        let citiesWithNoDublicates = duplicateReject(cities);

        // make datalist
        const datalist = document.querySelector('#cities');
        const selectCity = document.querySelector('#location');
        citiesWithNoDublicates.forEach(function (city) {
            const option = document.createElement('option');

            option.appendChild(document.createTextNode(city))
            option.value = city;

            const opt2 = option.cloneNode(true)
            datalist.appendChild(option);
            selectCity.appendChild(opt2);
            console.log(opt2);


        })

        // make room types been seen

        const roomTypesDetails = [...roomTypes[0]];
        const selectRoomType = document.querySelector("#typeOfRoom");
        console.log(roomTypesDetails);
        let roomTypesWithNoDublicates = duplicateReject(roomTypesDetails);

        roomTypesWithNoDublicates.forEach(function (roomType) {
            const option = document.createElement('option');
            //console.log(city);
            option.appendChild(document.createTextNode(roomType.name))
            option.value = roomType.name;
            selectRoomType.appendChild(option);

        })
        //create the lists and fill them with data

        createList(details);

        setMinMaxRange(details);

        //creating the events to fill the inputs  
        $("#price").on("change", (e) => {
            document.querySelector("#priceMessage").innerText = ` ${e.target.value}€`;

            createList(details.filter(li => priceFilter(li, e.target.value)));
            if (($("#price").val()) === "") {
                createList(details);
            }
        });
        $("#rating").on("change", (e) => {

            createList(details.filter(li => ratingFilter(li, e.target.value)));
            if (($("#rating").val()) === "") {
                createList(details);
            }
        });
        $("#guestRating").on("change", (e) => {

            createList(details.filter(li => guestRatingFilter(li, e.target.value)));
            if (($("#guestRating").val()) === "") {
                createList(details);
            }
        });
        $("#location").on("change", (e) => {


            createList(details.filter(li => locationFilter(li, e.target.value)));
            if (($("#location").val()) === "") {
                createList(details);
            }
        });
        $("#search-button").on("click", (e) => {

            createList(details.filter(li => locationFilter(li, $(".form-control").val())));
            if (($(".form-control").val()) === "") {
                createList(details);
            }
        });


        $("#recommendation").on("change", (e) => {
            createList(details.filter(li => recommendationFilter(li, e.target.value)));
            if (($("#recommendation").val()) === "") {
                createList(details);
            }

        });




    }





    //avoid using duplicating data
    function duplicateReject(inputs) {

        return inputs.filter((a, b) => inputs.indexOf(a) === b)
    }

    function createList(list) {

        const listOfHotels = $("#hotels");
        listOfHotels.empty();
        let itemsInsideOfList = "";
        const items = list.reduce((a, el) => (
            itemsInsideOfList += renderHotel(el)
        ), '');

        listOfHotels.append(items);
    }
    // function for filtering the prices 
    function priceFilter(item, price) {
        return parseFloat(item.price) <= price;
    }
    // function for filtering the locations 
    function locationFilter(item, city) {

        return (item.city) === city;
    }
    // function for the recommendations
    function recommendationFilter(item, rec) {


        let obj = "";
        (item.filters).forEach(function (f) {
            console.log((f.name));
            if (f.name === rec) {
                obj = f.name;

            }
            return (f.name) === rec;
        })
        console.log(rec);

        return obj;
    }
    function ratingFilter(item, rating) {

        return parseFloat(item.rating) == rating;
    }
    // using <if> to load the data from the json ratings
    function guestRatingFilter(item, guestrating) {
        console.log(item.ratings.no)
        if (guestrating === "0") {
            console.log("0")
            return (parseFloat(item.ratings.no) >= 0 && parseFloat(item.ratings.no) < 2);
        }
        if (guestrating === "1") {
            return (parseFloat(item.ratings.no) >= 2 && parseFloat(item.ratings.no) < 6);
        }
        if (guestrating === "2") {
            return (parseFloat(item.ratings.no) >= 6 && parseFloat(item.ratings.no) < 7);
        }
        if (guestrating === "3") {
            return (parseFloat(item.ratings.no) >= 7 && parseFloat(item.ratings.no) < 8.5);
        }
        if (guestrating === "4") {
            console.log("4")
            return (parseFloat(item.ratings.no) >= 8.5 && parseFloat(item.ratings.no) <= 10);
        }
        console.log(item.guestratings);
        return parseFloat(item.guestrating) >= guestrating;
    }
    //set the bar min max in the project
    function setMinMaxRange(list) {
        let min = Infinity;
        let max = -Infinity;
        list.forEach(el => {
            const price = parseFloat(el.price);
            if (price > max) max = price;
            if (price < min) min = price;
        });
        const price = document.querySelector("#price");
        price.setAttribute("min", min);
        price.setAttribute("max", max);
        price.setAttribute("value", max);
        document.querySelector("#forPrice").innerHTML = `<span id="labelPrice">Price </span> <span>Max:${max}</span>`;
    }

    // using an injection from here for the view of hotels like the product exercise
    function renderHotel(hotel) {
        const tmpl = `<div class="hotel col-12 row ml-0 p-0 border ">
                    <div class="hotel-media col-3 px-0">
                        <i class="far fa-heart"></i>
                        <img src="${hotel.thumbnail}" alt="hotel-photo" class="img-fluid">
                        <span class="img-pagin bg-dark text-white p-1 rounded">1/30</span>
                    </div>
                    <div class="info col-4"> 
                        <h6>${hotel.hotelName}</h6>
                            <span class='starPlace'>
                            <i class='${hotel.rating > 0 && "fas fa-star"}'></i>
                            <i class='${hotel.rating > 1 && "fas fa-star"}'></i>
                            <i class='${hotel.rating > 2 && "fas fa-star"}'></i>
                            <i class='${hotel.rating > 3 && "fas fa-star"}'></i>
                            <i class='${hotel.rating > 4 && "fas fa-star"}'></i>
                            
                              
                             </span>
                        <p>${hotel.city}</p>
                        <div>
                        <span  id="hotelRatings">${hotel.ratings.no}</span> <span>${hotel.ratings.text}</span>
                        </div>
                     </div>
                    <div class="deals col-2 text-center border"> <div class='deal1'> <span class='dealsDetail'>Hotel Website ${hotel.price}</span></div><div class='deal1'><span class='dealsDetail'> Agoda <br>575 </span></div><div class='deal1'> <span class='dealsDetail'>More Deals</span></div></div>
                    <div class="deal col-3">
                    <div class= "col-12 text-center forSectionDeal-website text-success"> Hotel Website </div>
                    <div class= "col-12 text-center" > ${hotel.price} 	&euro;</div>
                    <div class= "col-12 text-center forSectionDeal-website" >3 nights for <span class="text-success">${(hotel.price) * 3} </span> 	&euro;</div>
                    <button class="col-12 btn btn-success"> VIEW DEAL ></button>
                    </div>
                    
                </div>`;


        //Creating the modal
        var modal = document.getElementById("myModal");
        // Get the button that opens the modal
        const btn = document.getElementById("myBtn");
        // Get the option close for the modal
        const span = document.getElementsByClassName("close")[0];
        const maps = document.getElementById("maps");

        //Show i-frame with mapurl on click 
        btn.onclick = function () {
            modal.style.display = "block";

            maps.innerHTML += `<iframe src="${hotel.mapurl}" width=100%></iframe>`;
        }


        span.onclick = function () {
            modal.style.display = "none";
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
        // return tmpl; // Get the modal
        return tmpl;
    }



}
);