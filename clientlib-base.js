var ARTISAN = ARTISAN || {};

// global modal variables
ARTISAN.modal = {
	accordions : document.getElementById("investor-selection-modal").getElementsByClassName("accordion-item"),
	country_cookie: ARTISAN.utils.getCookie("country"),
	investor_type_cookie: ARTISAN.utils.getCookie("investor_type"),
	utils: {
		isHomepage: document.getElementsByTagName("body")[0].classList.contains("portal-homepage")
	}
};

// toggle dropdown
function toggleDropdown(el) {
	const dropdownList = el.nextElementSibling;
	// must have more than one country to show dropdown
	if (dropdownList.children.length > 1) {
		el.classList.toggle("active");
		dropdownList.classList.toggle("active");
	}
}

function showAccordionContent(accordion) {
	const content = accordion.getElementsByClassName("accordion-collapse")[0],
		button = accordion.getElementsByClassName("accordion-button")[0];
	content.classList.add("show");
	button.classList.remove("collapsed");
	button.ariaExpanded = true;
}

function hideAccordionContent(accordion) {
	const content = accordion.getElementsByClassName("accordion-collapse")[0],
		button = accordion.getElementsByClassName("accordion-button")[0];
	content.classList.remove("show");
	button.classList.add("collapsed");
	button.ariaExpanded = false;
}

function toggleModal(investor_type) {
	for (const accordion of ARTISAN.modal.accordions) {
		(accordion.getElementsByClassName("accordion-collapse")[0].id === investor_type) ?
			showAccordionContent(accordion) : hideAccordionContent(accordion);
	}
}

// init events within modal
function initModal() {

	for (const accordion of ARTISAN.modal.accordions) {
		const button = accordion.getElementsByTagName("button")[0],
			accordion_id = accordion.getElementsByClassName("accordion-collapse")[0].id,
			dropdown = accordion.getElementsByClassName("dropdown selected")[0],
			country_list = accordion.querySelector(".dropdown-list");//.children;

		if (country_list !== null) {
			const countries = country_list.children;

			// set dropdown defaults if country/investor type cookies exist
			if (accordion_id === ARTISAN.modal.investor_type_cookie && ARTISAN.modal.country_cookie !== null) {
				for (const country of countries) {
					const link = country.getElementsByTagName("a")[0];
					if (link.text.trim() === ARTISAN.modal.country_cookie) {
						dropdown.replaceChildren(country.cloneNode(true));
					}
				}
			} else {
				dropdown.replaceChildren(countries.item(0).cloneNode(true));
			}

			// replace selected item when selecting from dropdown list
			for (const country of countries) {
				country.getElementsByTagName("a")[0].addEventListener("click", function(event) {
					event.preventDefault();
					dropdown.replaceChildren(country.cloneNode(true));
					toggleDropdown(dropdown);
				});
			}
		}

		// toggle dropdown list
		dropdown.addEventListener("click", function(event) {
			event.preventDefault();
			toggleDropdown(dropdown);
		});

		// set cookie and redirect to site
		button.addEventListener("click", function (event) {
			const link =  dropdown.getElementsByTagName("a")[0],
				country_name = link.text.trim(),
				url = link.href,
				formatted_item_id = accordion.getElementsByTagName("h2")[0].textContent + ": " + country_name;

			event.preventDefault();
			button.setAttribute("disabled", "disabled");
			button.innerHTML = "<img src='/content/dam/artisan-portal/static/icon-loading.gif' alt='Loading' width='50%' class='img-fluid'>";

			ARTISAN.utils.deleteCookie("investor_type");
			ARTISAN.utils.deleteCookie("country");
			ARTISAN.utils.setCookie("investor_type", accordion_id, 30);
			ARTISAN.utils.setCookie("country", country_name, 30);

			ARTISAN.analytics.sendEvent("select_content", {
				content_type: "Portal Country Click",
				item_id: formatted_item_id
			});

			setTimeout(() => {
				window.location = url;
			}, 1500);
		});

		// hide dropdown when accordion is collapsed
		accordion.addEventListener("hidden.bs.collapse", function(event) {
			if (dropdown.classList.contains("active")) {
				toggleDropdown(dropdown);
			}
		});
	}
}

(function() {

	initModal();

	// homepage investor type selection
	if (ARTISAN.modal.utils.isHomepage) {
		document.querySelectorAll("#channels a").forEach(function (channel) {
			channel.addEventListener("click", function (event) {
				toggleModal(event.target.dataset.value);
			});
		});
	} else {
		// header investor type selection
		document.getElementById("investor-type-selection").addEventListener("click", function(event) {
			toggleModal(null);
		});
	}
})();

function newsPage() {
    const keywords = document.querySelector("meta[name='keywords']");
    if (keywords !== null && keywords.content === "news") {
        var $year		= $(".row.year h2");
        var $archive	= $(".archive");

        $year.each(function() {
            var $this = $(this);
            $this.on("click",function() {
                $this.toggleClass("open");
                $this.parent().parent().next($archive).slideToggle("fast");
            });
        });
    }
}

// callback to validate recaptcha field
function recaptchaCallback() {
    $("#hiddenRecaptcha").valid();
}

function contactPage() {
    const container = document.getElementById("contact-form-container");
    if (container !== null) {
        $(container).load("/content/artisanpartners/en_us/contact-us/formcontent.html", function() {

            const formEl = document.getElementById("portal-contact-form");
            const fax = document.getElementById("fax"); // hp element

            if (fax !== null) {
                fax.tabIndex = -1;
                fax.autocomplete = "off";
            }

            $(formEl).validate({
                ignore: ".ignore",
                rules: {
                    firstName: { required: true },
                    lastName: { required: true },
                    email: { required: true, email: true },
                    investorType: { required: true },
                    country: { required: true },
                    comments: { required: true },
                    hiddenRecaptcha: {
                        required: function () {
                            return (grecaptcha.getResponse() == "") ? true : false;
                        }
                    }
                },
                submitHandler: function(form) {
                    if(fax !== null && fax.value.length === 0) {
                        form.submit();
                    } else {
                        return false;
                    }
                },
                invalidHandler: function(e,validator) {
                    const errors = validator.numberOfInvalids();
                    if(errors) {
                        const $alert = $(this).find("#form-alert");
                        const message = errors == 1 ? "Please correct the error below." : "Please correct the errors below.";
                        $alert.text(message).removeClass("d-none");
                    }
                }
            });
        });
    }
}

function aplpVideoPlayer() {
    if (document.getElementById("chapters") !== null) {
        videojs.getPlayer("aplp-video-player").ready(function() {

            const player = this,
                wrapper = document.getElementById("aplp-video-outer-wrapper"),
                mediaId = wrapper.dataset.mediaId,
                mediaType = wrapper.dataset.mediaType,
                el_chapters = document.getElementById("chapters"),
                searchParams = new URLSearchParams(document.location.search),
                searchParamsVideo = searchParams.get("video"),
                searchParamsChapter = searchParams.get("chapter"),
                disable_scroller = el_chapters.classList.contains("disable-scroller"),
                scroller_el = document.getElementById("video-scroller");

            let loaded = false,
                isMultiple = false,
                isPlaylist = (mediaType === "playlist"),
                swiper = null,
                videos = null,
                videoProgress = {
                    duration: 0,
                    percent: 0,
                    greatestMarker: [],
                    markers: [5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95],
                    formatTime: function(seconds) {
                        return (new Date(seconds * 1000).toISOString().slice(11, 19));
                    },
                    getDuration: function() {
                        return this.formatTime(this.duration);
                    },
                    getPercent: function() {
                        return (this.percent + "%");
                    }
                },
                textTracks = {
                    getActiveCueTitle: function() {
                        return this.hasActiveCues() ? this.getChapters()[0].activeCues[0].text : null;
                    },
                    getActiveCueStartTime: function() {
                        return this.hasActiveCues() ? this.getChapters()[0].activeCues[0].startTime : null;
                    },
                    getChapters: function() {
                        return [].filter.call(player.textTracks(), function(tt) {
                            return tt.kind === "chapters";
                        });
                    },
                    getCues: function() {
                        return this.hasChapters() ? this.getChapters()[0].cues : null;
                    },
                    hasActiveCues: function() {
                        return this.getChapters()[0].activeCues.length > 0;
                    },
                    hasChapters: function() {
                        return this.getChapters().length > 0;
                    }
                };

            function hideScroller() {
                scroller_el.remove();
            }

            function loadingComplete() {
                scroller_el.getElementsByClassName("loading")[0].remove();
                scroller_el.getElementsByClassName("loading-complete")[0].style.display = "block";
            }

            function createSlider() {
                const item = (searchParamsVideo !== null && (searchParamsVideo >= 1 && searchParamsVideo <= videos.length)) ? (searchParamsVideo-1) : 0;
                swiper = new Swiper(".swiper", {
                    spaceBetween: 10,
                    slidesPerView: 4,
                    initialSlide: item,
                    navigation: {
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                    }
                });
            }

            function handleSliderEvents() {
                const slides = document.getElementById("playlist").getElementsByTagName("li");
                for (let slide=0; slide < slides.length; slide++) {
                    slides[slide].addEventListener("click", function(e) {
                        playVideo(slide);
                    });
                }
            }

            function handleChapterEvents() {
                const el_select = el_chapters.getElementsByTagName("select")[0];
                el_select.addEventListener("change", function(event) {
                    player.currentTime(this.value);
                    player.play();
                    sendAnalytics(event);
                });
            }

            function createHtml() {
                if (isPlaylist) { // playlists
                    if (isMultiple) {
                        const list = document.getElementById("playlist");
                        if (disable_scroller) { // playlist without scroller
                            videos.forEach(function(video) {
                                const lineEl = document.createElement("li"),
                                    spanEl = document.createElement("span"),
                                    imgEl = document.createElement("img"),
                                    videoName = document.createTextNode(video.name);
                                lineEl.setAttribute("data-id",video.id);
                                imgEl.setAttribute("src", video.poster);
                                imgEl.setAttribute("class", "img-fluid");
                                spanEl.setAttribute("class", "display-name");
                                spanEl.appendChild(videoName);
                                lineEl.appendChild(imgEl);
                                lineEl.appendChild(spanEl);
                                list.appendChild(lineEl);
                            });
                        } else { // playlist with scroller
                            el_chapters.classList.add("swiper");
                            list.classList.add("swiper-wrapper");
                            videos.forEach(function(video) {
                                const lineEl = document.createElement("li"),
                                    spanEl = document.createElement("span"),
                                    imgEl = document.createElement("img"),
                                    videoName = document.createTextNode(video.name);
                                lineEl.setAttribute("class","swiper-slide");
                                lineEl.setAttribute("data-id",video.id);
                                imgEl.setAttribute("src", video.thumbnail);
                                imgEl.setAttribute("class", "img-fluid");
                                spanEl.setAttribute("class", "display-name");
                                spanEl.appendChild(videoName);
                                lineEl.appendChild(imgEl);
                                lineEl.appendChild(spanEl);
                                list.appendChild(lineEl);
                            });
                            const prev = document.createElement("div"),
                                next = document.createElement("div");
                            prev.setAttribute("class", "swiper-button-prev");
                            next.setAttribute("class", "swiper-button-next");
                            scroller_el.append(prev);
                            scroller_el.append(next);
                            createSlider();
                        }
                        loadingComplete();
                        handleSliderEvents();
                    } else {
                        hideScroller();
                    }
                } else { // single videos
                    if (textTracks.hasChapters()) {
                        const cues = textTracks.getCues(),
                            el_select = document.createElement("select");
                        for (let x=0; x<cues.length; x++) {
                            const el_option = document.createElement("option"),
                                startTime = cues[x].startTime,
                                text = cues[x].text + " (" + videoProgress.formatTime(startTime) + ")";
                            el_option.setAttribute("value", startTime);
                            el_option.innerText = text;
                            el_select.appendChild(el_option);
                        }
                        if (searchParamsChapter !== null && (searchParamsChapter >= 1 && searchParamsChapter <= cues.length)) {
                            player.currentTime(cues[searchParamsChapter-1].startTime);
                        }
                        el_chapters.appendChild(el_select);
                        loadingComplete();
                        handleChapterEvents();
                    } else {
                        hideScroller();
                    }
                }
            }

            function playVideo(video) {
                player.playlist.currentItem(video);
                player.play();
            }

            function playNextVideo() {
                if (isPlaylist) {
                    const currentItem = player.playlist.currentItem();
                    if (currentItem === videos.length-1) {
                        if (isMultiple) {
                            swiper.destroy(false, false);
                            swiper = new Swiper(".swiper", {
                                spaceBetween: 10,
                                slidesPerView: 4,
                                initialSlide: 0,
                                navigation: {
                                    nextEl: ".swiper-button-next",
                                    prevEl: ".swiper-button-prev",
                                }
                            });
                        }
                        player.playlist.currentItem(0);
                    } else {
                        player.playlist.next();
                    }
                } else {
                    player.currentTime(0);
                }
            }

            function clearGreatestMarker() {
                videoProgress.greatestMarker = [];
            }

            function sendAnalytics(event) {
                if (event.type === "change") {
                    const type = "Video Chapter Selection",
                        item = "video: " + player.mediainfo.name + " | chapter: " + textTracks.getActiveCueTitle();
                    ARTISAN.analytics.sendEvent("select_content", {
                        content_type: type,
                        item_id: item
                    });
                } else {
                    const action = isPlaylist ? ("playlist: " + player.playlistinfo.name + " | video: " + player.mediainfo.name) : ("video: " + player.mediainfo.name);
                    ARTISAN.analytics.sendEvent("media_play", {
                        media_name: action,
                        media_type: "video",
                        media_progress: videoProgress.getPercent(),
                        media_duration: videoProgress.getDuration(),
                        media_playbackrate: player.playbackRate()
                    });
                }
            }

            function updateNowPlaying() {
                if (isMultiple) {
                    const videoTitle = document.getElementById("now-playing").getElementsByClassName("video-title")[0],
                        slideContainers = document.getElementById("playlist").getElementsByTagName("li");
                    // updates 'Now Playing' text
                    videoTitle.innerHTML = player.mediainfo.name;
                    // highlights video in scroller
                    for (const container of slideContainers) {
                        if (container.classList.contains("active")) {
                            container.classList.remove("active");
                        }
                        if (container.dataset.id === player.mediainfo.id) {
                            container.classList.add("active");
                        }
                    }
                }
            }

            function setDuration() {
                videoProgress.duration = player.mediainfo.duration;
            }

            function setProgress(percent) {
                videoProgress.percent = percent;
            }

            function checkProgress(event) {
                const currentPercent = Math.floor(player.currentTime()/videoProgress.duration*100);
                if (videoProgress.markers.indexOf(currentPercent) > -1 && videoProgress.greatestMarker.indexOf(currentPercent) === -1) {
                    videoProgress.greatestMarker.push(currentPercent);
                    setProgress(currentPercent);
                    sendAnalytics(event);
                }

                // change text track dropdown
                if (!isPlaylist && textTracks.hasChapters()) {
                    const activeCueStartTime = textTracks.getActiveCueStartTime(),
                        el_select = el_chapters.getElementsByTagName("select")[0],
                        currentChaptersValue = el_select.value;
                    if (activeCueStartTime !==  null && activeCueStartTime !== currentChaptersValue) {
                        el_select.value = activeCueStartTime;
                    }
                }
            }

            function initPlayer() {
                // init player only once
                if (!loaded) {
                    if (isPlaylist) {
                        videos = player.catalog.data.videos;
                        if (videos.length > 1) isMultiple = true;
                        player.playlist.repeat(false);
                        // get playlist video based on url parameter (video)
                        if (searchParamsVideo !== null && (searchParamsVideo >= 1 && searchParamsVideo <= videos.length)) {
                            player.playlist.currentItem(searchParamsVideo-1);
                        }
                    }
                    createHtml();
                    loaded = true;
                }
            }

            player.on("loadedmetadata", function() {
                initPlayer();
                clearGreatestMarker();
                setDuration();
                updateNowPlaying();
            });

            player.on("firstplay", function(event) {
                setProgress(0);
                sendAnalytics(event);
            });

            player.on("ended", function(event) {
                setProgress(100);
                sendAnalytics(event);
                playNextVideo();
            });

            player.on("timeupdate", function(event) {
                checkProgress(event);
            });

            // main function that loads media into player
            (function() {
                let options = {};
                if (isPlaylist) {
                    options.playlistId = mediaId;
                } else {
                    options.videoId = mediaId;
                }
                player.catalog.autoFindAndLoadMedia(options);
            })();
        }); // end: videojs()
    }
}

function analytics() {
    // homepage promo links
    const promos = document.getElementById("promo-wrapper");
    if (promos !== null) {
        const links = promos.getElementsByTagName("a");
        for (const link of links) {
            link.addEventListener("click", function (event) {
                event.preventDefault();
                ARTISAN.analytics.sendEvent("select_content", {
                    content_type: "Portal Promo Click",
                    item_id: link.text
                });
                window.location = link.href;
            });
        }
    }
}

// highlights top navigation item on desktop views
function setNavigation() {
    if (ARTISAN.utils.isBreakpoint("xl") || ARTISAN.utils.isBreakpoint("xxl")) {
        const page_id = document.querySelector("meta[name=keywords]").content,
            nav_items = document.querySelectorAll(".navbar-nav li");

        if (page_id !== null) {
            for (const item of nav_items) {
                if (item.dataset.title === page_id) {
                    item.classList.add("active");
                }
            }
        }
    }
}

// open pdf in new window
function openPDFInNewWindow() {
    const links = document.getElementsByTagName("a");
    for (const link of links) {
        if (link.href.endsWith(".pdf")) {
            link.target = "_blank";
        }
    }
}

// functions to call on window resize
let resizeTimer;
window.addEventListener("resize", function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        setNavigation();
    },100);
});

// put scripts that need DOM to be loaded here
ARTISAN.utils.DOMLoaded(function() {
    setNavigation();
    analytics();
    aplpVideoPlayer();
    openPDFInNewWindow();
    contactPage();
    newsPage();
});

// put scripts that don't need DOM to be loaded here
(function() {})();
