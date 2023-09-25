/* =========================================================
 * Created by Sunil Solanki
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */

(function (global) {
  class ztTour {
    constructor(options, templates) {
      this.initializeOptions(options);
      this.initializeTemplate(templates);

      this.popup = null;
      this.overlaySvg = null;
      this.currentStep = 0;
      this.activeStagePosition = null;

      this.onKeyUp = this.onKeyUp.bind(this);
      this.refreshStep = this.refreshStep.bind(this);

      this.initEvents();

      this.onNextClick = options.onNextClick || null;
      this.onClose = options.onClose || null;
      this.onPreviousClick = options.onPreviousClick || null;
    }

    // initialize Options
    initializeOptions(opt) {
      if (opt == null) {
        opt = {};
      }

      this.options = {
        steps: opt.steps || [],
        overlayOpacity: opt.overlayOpacity || 0.7,
        stagePadding: opt.stagePadding || 10,
        popupOffset: opt.popupOffset || 10,
        stageRadius: opt.stageRadius || 5,
        overlayColor: opt.overlayColor || "#000",
        animate: opt.animate !== undefined ? opt.animate : true,
        smoothScroll: opt.smoothScroll || false,
        visibleButtons: opt.visibleButtons || ["next", "previous", "close"],
        disableButtons: opt.disableButtons || [],
        showProgress: opt.showProgress || false,
        nextBtnText: opt.nextBtnText || "Next &rarr;",
        prevBtnText: opt.prevBtnText || "&larr; Previous",
        doneBtnText: opt.doneBtnText || "Done",
        allowBackdropClose: opt.allowBackdropClose !== undefined ? opt.allowBackdropClose : true,
        popupClass: opt.popupClass || false,
        keyboardControl: opt.keyboardControl !== undefined ? opt.keyboardControl : true,
        animationDuration: opt.animationDuration || 400,
      };
    }

    initializeTemplate(templ) {
      if (templ == null) {
        templ = {};
      }
      this.templates = {
        progressText:
          templ.progressText || ((current, total) => `${current} of ${total}`),
      };
    }

    initEvents() {
      window.addEventListener("keyup", this.onKeyUp, false);
      window.addEventListener("resize", this.refreshStep, false);
      window.addEventListener("scroll", this.refreshStep, false);
    }

    onKeyUp(e) {
      const keyboardControl = this.getOption("keyboardControl");
      if (keyboardControl) {
        if (e.key === "Escape") {
          this.destroyTour();
        } else if (e.key === "ArrowRight") {
          this.highlightStep(this.getOption("currentStep") + 1);
        } else if (e.key === "ArrowLeft") {
          this.highlightStep(this.getOption("currentStep") - 1);
        }
      }
    }

    destroyEvents() {
      window.removeEventListener("keyup", this.onKeyUp);
      window.removeEventListener("resize", this.refreshStep);
      window.removeEventListener("scroll", this.refreshStep);
    }

    getOption(key) {
      if (!key) {
        return this.options;
      }
      return this.options[key];
    }

    setOption(key, val) {
      this.options[key] = val;
    }

    throwError(error) {
      throw new Error(error);
    }

    start() {
      this.highlightStep(0);
    }

    showHint(hint, isAnnouncement = false){
      this.removeHint(isAnnouncement);

      let popupType = isAnnouncement ? "announcement" : "hint";

      let hintEle = document.createElement("div");
      let hintBackdrop = document.createElement("div");
      hintBackdrop.classList.add(`zt-tour-${popupType}-backdrop`);
      hintBackdrop.addEventListener('click',()=>{
        hintEle.remove();
        hintBackdrop.remove();
      })
      hintEle.innerHTML = hint.innerHTML;
      hintEle.classList.add(`zt-tour-${popupType}`);

      let dimentions;
      if(!isAnnouncement){
        dimentions = document.querySelector(hint.element).getBoundingClientRect();
      } 
      
      document.body.appendChild(hintBackdrop);
      document.body.appendChild(hintEle);
      

      hintEle.style.top = isAnnouncement ? "50%" : dimentions.top + dimentions.height + 10 + "px";
      hintEle.style.left = isAnnouncement ? "50%" : dimentions.left + 10 + "px";
      hintEle.style.transform = isAnnouncement ? "translate(-50%, -50%)" : "";
    }

    showAnnouncement(announcement){
      announcement = {innerHTML: announcement};
      this.showHint(announcement, true);
    }

    removeHint(isAnnouncement = false){
      let popupType = isAnnouncement ? "announcement" : "hint";
      let oldHint = document.querySelectorAll(`.zt-tour-${popupType}`);
      let oldHintBackdrop = document.querySelectorAll(`.zt-tour-${popupType}-backdrop`);

      Array.from(oldHint).forEach((hint)=>hint.remove())
      Array.from(oldHintBackdrop).forEach((hintBackdrop)=>hintBackdrop.remove())
    }

    removeAnnouncement(){
      removeHint(true);
    }

    highlightStep(currentStep) {
      if (0 > currentStep || currentStep > this.getOption("steps").length - 1) {
        this.destroyTour();
        return;
      }

      let step = this.options.steps[currentStep];
      let element = document.querySelector(step?.element);

      if (!element) {
        element = this.addDummyElement();
      }

      this.changeHighlight(element, step, currentStep);
    }

    createPopup() {
      const wrapper = document.createElement("div");
      wrapper.classList.add("zt-tour-popup");
      if (this.getOption("popupClass")) {
        wrapper.classList.add(this.getOption("popupClass").trim());
      }

      const arrow = document.createElement("div");
      arrow.classList.add("zt-tour-popup-arrow");

      const title = document.createElement("header");
      title.id = "zt-tour-popup-title";
      title.classList.add("zt-tour-popup-title");
      title.style.display = "none";
      title.innerText = "Popup Title";

      const description = document.createElement("div");
      description.id = "zt-tour-popup-description";
      description.classList.add("zt-tour-popup-description");
      description.style.display = "none";
      description.innerText = "Popup description is here";

      const closeButton = document.createElement("button");
      closeButton.type = "button";
      closeButton.classList.add("zt-tour-popup-close-btn");
      closeButton.setAttribute("aria-label", "Close");
      closeButton.innerHTML = "&times;";

      const footer = document.createElement("footer");
      footer.classList.add("zt-tour-popup-footer");

      const progress = document.createElement("span");
      progress.classList.add("zt-tour-popup-progress-text");
      progress.innerText = "";

      const footerButtons = document.createElement("span");
      footerButtons.classList.add("zt-tour-popup-navigation-btns");

      const previousButton = document.createElement("button");
      previousButton.type = "button";
      previousButton.classList.add("zt-tour-popup-prev-btn");
      previousButton.innerHTML = "&larr; Previous";

      const nextButton = document.createElement("button");
      nextButton.type = "button";
      nextButton.classList.add("zt-tour-popup-next-btn");
      nextButton.innerHTML = "Next &rarr;";

      footerButtons.appendChild(previousButton);
      footerButtons.appendChild(nextButton);
      footer.appendChild(progress);
      footer.appendChild(footerButtons);

      wrapper.appendChild(closeButton);
      wrapper.appendChild(arrow);
      wrapper.appendChild(title);
      wrapper.appendChild(description);
      wrapper.appendChild(footer);

      return {
        wrapper,
        arrow,
        title,
        description,
        footer,
        previousButton,
        nextButton,
        closeButton,
        footerButtons,
        progress,
      };
    }

    renderPopup(element, step) {
      let popup = this.createPopup();
      this.options.popup = popup;

      let oldPopups = document.querySelectorAll(".zt-tour-popup");

      // remove all old popups
      Array.from(oldPopups).forEach((ele) => {
        ele.remove();
      });

      document.body.appendChild(popup.wrapper);

      let {
        title,
        description,
        visibleButtons,
        disableButtons,
        showProgress,
        nextBtnText = this.options.nextBtnText,
        prevBtnText = this.options.prevBtnText,
        progressText = this.templates.progressText(
          this.options.currentStep + 1,
          this.options.steps.length
        ),
      } = step.popup || {};

      if (this.options.currentStep + 1 === this.options.steps.length) {
        nextBtnText = this.options.doneBtnText;
      }

      if (this.options.currentStep === 0) {
        popup.previousButton.disabled = true;
      }

      popup.nextButton.innerHTML = nextBtnText;
      popup.previousButton.innerHTML = prevBtnText;
      popup.progress.innerHTML = progressText;

      if (title) {
        popup.title.innerHTML = title;
        popup.title.style.display = "block";
      } else {
        popup.title.style.display = "none";
      }

      if (description) {
        popup.description.innerHTML = description;
        popup.description.style.display = "block";
      } else {
        popup.description.style.display = "none";
      }

      const showButtonsOption =
        visibleButtons || this.getOption("visibleButtons");
      const isShowProgress = showProgress || this.getOption("showProgress");

      const isShowFooter =
        showButtonsOption.includes("next") ||
        showButtonsOption?.includes("previous") ||
        isShowProgress;

      popup.closeButton.style.display = showButtonsOption.includes("close")
        ? "block"
        : "none";

      if (isShowFooter) {
        popup.footer.style.display = "flex";

        popup.progress.style.display = isShowProgress ? "block" : "none";
        popup.nextButton.style.display = showButtonsOption.includes("next")
          ? "block"
          : "none";
        popup.previousButton.style.display = showButtonsOption.includes(
          "previous"
        )
          ? "block"
          : "none";
      } else {
        popup.footer.style.display = "none";
      }

      const disabledButtonsOption =
        disableButtons || this.getOption("disableButtons");
      if (disabledButtonsOption?.includes("next")) {
        popup.nextButton.disabled = true;
      }

      if (disabledButtonsOption?.includes("previous")) {
        popup.previousButton.disabled = true;
      }

      if (disabledButtonsOption?.includes("close")) {
        popup.closeButton.disabled = true;
      }

      popup.nextButton.addEventListener("click", () => {
        let isOutOfIndex =
          this.options.currentStep + 1 < 0 ||
          this.options.currentStep + 1 >= this.getOption("steps").length;
        this.highlightStep(this.options.currentStep + 1);
        if (typeof this.onNextClick === "function" && !isOutOfIndex) {
          this.onNextClick(this.options.currentStep);
        }
      });

      popup.previousButton.addEventListener("click", () => {
        this.highlightStep(this.options.currentStep - 1);
        if (typeof this.onPreviousClick === "function") {
          this.onPreviousClick(this.options.currentStep);
        }
      });

      popup.closeButton.addEventListener("click", () => {
        this.destroyTour();
        if (typeof this.onClose === "function") {
          this.onClose();
        }
      });

      this.repositionPopup(element, step);
    }

    hidePopup() {
      const popup = this.getOption("popup");
      if (!popup) {
        return;
      }

      popup.wrapper.style.display = "none";
    }

    renderPopupArrow(alignment, side, element) {
      const elementDimensions = element.getBoundingClientRect();
      const popupDimensions = this.getPopupDimensions();
      const popupArrow = this.options.popup.arrow;

      const popupWidth = popupDimensions.width;
      const windowWidth = window.innerWidth;
      const elementWidth = elementDimensions.width;
      const elementLeft = elementDimensions.left;

      const popupHeight = popupDimensions.height;
      const windowHeight = window.innerHeight;
      const elementTop = elementDimensions.top;
      const elementHeight = elementDimensions.height;

      // Remove all arrow classes
      popupArrow.className = "zt-tour-popup-arrow";

      let arrowSide = side;
      let arrowAlignment = alignment;

      if (side === "top") {
        if (elementLeft + elementWidth <= 0) {
          arrowSide = "right";
          arrowAlignment = "end";
        } else if (elementLeft + elementWidth - popupWidth <= 0) {
          arrowSide = "top";
          arrowAlignment = "start";
        }
        if (elementLeft >= windowWidth) {
          arrowSide = "left";
          arrowAlignment = "end";
        } else if (elementLeft + popupWidth >= windowWidth) {
          arrowSide = "top";
          arrowAlignment = "end";
        }
      } else if (side === "bottom") {
        if (elementLeft + elementWidth <= 0) {
          arrowSide = "right";
          arrowAlignment = "start";
        } else if (elementLeft + elementWidth - popupWidth <= 0) {
          arrowSide = "bottom";
          arrowAlignment = "start";
        }
        if (elementLeft >= windowWidth) {
          arrowSide = "left";
          arrowAlignment = "start";
        } else if (elementLeft + popupWidth >= windowWidth) {
          arrowSide = "bottom";
          arrowAlignment = "end";
        }
      } else if (side === "left") {
        if (elementTop + elementHeight <= 0) {
          arrowSide = "bottom";
          arrowAlignment = "end";
        } else if (elementTop + elementHeight - popupHeight <= 0) {
          arrowSide = "left";
          arrowAlignment = "start";
        }

        if (elementTop >= windowHeight) {
          arrowSide = "top";
          arrowAlignment = "end";
        } else if (elementTop + popupHeight >= windowHeight) {
          arrowSide = "left";
          arrowAlignment = "end";
        }
      } else if (side === "right") {
        if (elementTop + elementHeight <= 0) {
          arrowSide = "bottom";
          arrowAlignment = "start";
        } else if (elementTop + elementHeight - popupHeight <= 0) {
          arrowSide = "right";
          arrowAlignment = "start";
        }

        if (elementTop >= windowHeight) {
          arrowSide = "top";
          arrowAlignment = "start";
        } else if (elementTop + popupHeight >= windowHeight) {
          arrowSide = "right";
          arrowAlignment = "end";
        }
      } else {
      }

      if (!arrowSide) {
        popupArrow.classList.add("zt-tour-d-none");
      } else {
        popupArrow.classList.add(`zt-tour-popup-arrow-side-${arrowSide}`);
        popupArrow.classList.add(`zt-tour-popup-arrow-align-${arrowAlignment}`);
      }
    }

    getPopupDimensions() {
      const boundingClientRect =
        this.options.popup.wrapper.getBoundingClientRect();

      const stagePadding = this.options.stagePadding || 0;
      const popupOffset = this.options.popupOffset || 0;

      return {
        width: boundingClientRect.width + stagePadding + popupOffset,
        height: boundingClientRect.height + stagePadding + popupOffset,

        realWidth: boundingClientRect.width,
        realHeight: boundingClientRect.height,
      };
    }

    // create svg
    createOverlaySvg(stage) {
      const windowX = window.innerWidth;
      const windowY = window.innerHeight;

      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.classList.add("zt-tour-overlay", "zt-tour-overlay-animated");

      svg.setAttribute("viewBox", `0 0 ${windowX} ${windowY}`);
      svg.setAttribute("xmlSpace", "preserve");
      svg.setAttribute("xmlnsXlink", "http://www.w3.org/1999/xlink");
      svg.setAttribute("version", "1.1");
      svg.setAttribute("preserveAspectRatio", "xMinYMin slice");

      svg.style.fillRule = "evenodd";
      svg.style.clipRule = "evenodd";
      svg.style.strokeLinejoin = "round";
      svg.style.strokeMiterlimit = "2";
      svg.style.zIndex = "10000";
      svg.style.position = "fixed";
      svg.style.top = "0";
      svg.style.left = "0";
      svg.style.width = "100%";
      svg.style.height = "100%";

      const stagePath = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );

      stagePath.setAttribute("d", this.generateStageSvgPathString(stage));

      stagePath.style.fill = this.options.overlayColor || "rgb(0,0,0)";
      stagePath.style.opacity = `${this.options.overlayOpacity}`;
      stagePath.style.pointerEvents = "auto";
      stagePath.style.cursor = "auto";

      svg.addEventListener("click", () => {
        if (this.getOption("allowBackdropClose")) {
          this.destroyTour();
          if (typeof this.onClose === "function") {
            this.onClose();
          }
        }
      });

      svg.appendChild(stagePath);

      return svg;
    }

    // generate svg path
    generateStageSvgPathString(stage) {
      const windowX = window.innerWidth;
      const windowY = window.innerHeight;

      const stagePadding = this.options.stagePadding || 0;
      const stageRadius = this.options.stageRadius || 0;

      const stageWidth = stage.width + stagePadding * 2;
      const stageHeight = stage.height + stagePadding * 2;

      // prevent glitches when stage is too small for radius
      const limitedRadius = Math.min(
        stageRadius,
        stageWidth / 2,
        stageHeight / 2
      );

      // no value below 0 allowed + round down
      const normalizedRadius = Math.floor(Math.max(limitedRadius, 0));

      const highlightBoxX = stage.x - stagePadding + normalizedRadius;
      const highlightBoxY = stage.y - stagePadding;
      const highlightBoxWidth = stageWidth - normalizedRadius * 2;
      const highlightBoxHeight = stageHeight - normalizedRadius * 2;

      return `M${windowX},0L0,0L0,${windowY}L${windowX},${windowY}L${windowX},0Z
      M${highlightBoxX},${highlightBoxY} h${highlightBoxWidth} a${normalizedRadius},${normalizedRadius} 0 0 1 ${normalizedRadius},${normalizedRadius} v${highlightBoxHeight} a${normalizedRadius},${normalizedRadius} 0 0 1 -${normalizedRadius},${normalizedRadius} h-${highlightBoxWidth} a${normalizedRadius},${normalizedRadius} 0 0 1 -${normalizedRadius},-${normalizedRadius} v-${highlightBoxHeight} a${normalizedRadius},${normalizedRadius} 0 0 1 ${normalizedRadius},-${normalizedRadius} z`;
    }

    repositionPopup(element, step) {
      const popup = this.options.popup;
      let { align = "start", side = "left" } = step?.popup || {};

      align = step.element ? align : "over";
      side = step.element ? side : "over";

      // Configure the popup positioning
      const requiredAlignment = align;
      const requiredSide = side;
      const popupPadding = this.options.stagePadding;

      const popupDimensions = this.getPopupDimensions();
      const popupArrowDimensions = popup.arrow.getBoundingClientRect();
      const elementDimensions = element.getBoundingClientRect();

      const topValue = elementDimensions.top - popupDimensions.height;
      let isTopOptimal = topValue >= 0;

      const bottomValue =
        window.innerHeight -
        (elementDimensions.bottom + popupDimensions.height);
      let isBottomOptimal = bottomValue >= 0;

      const leftValue = elementDimensions.left - popupDimensions.width;
      let isLeftOptimal = leftValue >= 0;

      const rightValue =
        window.innerWidth - (elementDimensions.right + popupDimensions.width);
      let isRightOptimal = rightValue >= 0;

      const noneOptimal =
        !isTopOptimal && !isBottomOptimal && !isLeftOptimal && !isRightOptimal;
      let popupRenderedSide = requiredSide;

      if (requiredSide === "top" && isTopOptimal) {
        isRightOptimal = isLeftOptimal = isBottomOptimal = false;
      } else if (requiredSide === "bottom" && isBottomOptimal) {
        isRightOptimal = isLeftOptimal = isTopOptimal = false;
      } else if (requiredSide === "left" && isLeftOptimal) {
        isRightOptimal = isTopOptimal = isBottomOptimal = false;
      } else if (requiredSide === "right" && isRightOptimal) {
        isLeftOptimal = isTopOptimal = isBottomOptimal = false;
      }

      if (requiredSide === "over") {
        const leftToSet = window.innerWidth / 2 - popupDimensions.realWidth / 2;
        const topToSet =
          window.innerHeight / 2 - popupDimensions.realHeight / 2;

        popup.wrapper.style.left = `${leftToSet}px`;
        popup.wrapper.style.right = `auto`;
        popup.wrapper.style.top = `${topToSet}px`;
        popup.wrapper.style.bottom = `auto`;
      } else if (noneOptimal) {
        const leftValue =
          window.innerWidth / 2 - popupDimensions?.realWidth / 2;
        const bottomValue = 10;

        popup.wrapper.style.left = `${leftValue}px`;
        popup.wrapper.style.right = `auto`;
        popup.wrapper.style.bottom = `${bottomValue}px`;
        popup.wrapper.style.top = `auto`;
      } else if (isLeftOptimal) {
        const leftToSet = Math.min(
          leftValue,
          window.innerWidth -
            popupDimensions?.realWidth -
            popupArrowDimensions.width
        );

        const topToSet = this.calculateTopForLeftRight(requiredAlignment, {
          elementDimensions,
          popupDimensions,
          popupPadding,
          popupArrowDimensions,
        });

        popup.wrapper.style.left = `${leftToSet}px`;
        popup.wrapper.style.top = `${topToSet}px`;
        popup.wrapper.style.bottom = `auto`;
        popup.wrapper.style.right = "auto";

        popupRenderedSide = "left";
      } else if (isRightOptimal) {
        const rightToSet = Math.min(
          rightValue,
          window.innerWidth -
            popupDimensions?.realWidth -
            popupArrowDimensions.width
        );
        const topToSet = this.calculateTopForLeftRight(requiredAlignment, {
          elementDimensions,
          popupDimensions,
          popupPadding,
          popupArrowDimensions,
        });

        popup.wrapper.style.right = `${rightToSet}px`;
        popup.wrapper.style.top = `${topToSet}px`;
        popup.wrapper.style.bottom = `auto`;
        popup.wrapper.style.left = "auto";

        popupRenderedSide = "right";
      } else if (isTopOptimal) {
        const topToSet = Math.min(
          topValue,
          window.innerHeight -
            popupDimensions.realHeight -
            popupArrowDimensions.width
        );
        let leftToSet = this.calculateLeftForTopBottom(requiredAlignment, {
          elementDimensions,
          popupDimensions,
          popupPadding,
          popupArrowDimensions,
        });

        popup.wrapper.style.top = `${topToSet}px`;
        popup.wrapper.style.left = `${leftToSet}px`;
        popup.wrapper.style.bottom = `auto`;
        popup.wrapper.style.right = "auto";

        popupRenderedSide = "top";
      } else if (isBottomOptimal) {
        const bottomToSet = Math.min(
          bottomValue,
          window.innerHeight -
            popupDimensions?.realHeight -
            popupArrowDimensions.width
        );

        let leftToSet = this.calculateLeftForTopBottom(requiredAlignment, {
          elementDimensions,
          popupDimensions,
          popupPadding,
          popupArrowDimensions,
        });

        popup.wrapper.style.left = `${leftToSet}px`;
        popup.wrapper.style.bottom = `${bottomToSet}px`;
        popup.wrapper.style.top = `auto`;
        popup.wrapper.style.right = "auto";

        popupRenderedSide = "bottom";
      }

      if (!noneOptimal) {
        this.renderPopupArrow(requiredAlignment, popupRenderedSide, element);
      } else {
        popup.arrow.classList.add("zt-tour-d-none");
      }
    }

    calculateLeftForTopBottom(alignment, config) {
      const {
        elementDimensions,
        popupDimensions,
        popupPadding,
        popupArrowDimensions,
      } = config;

      if (alignment === "start") {
        return Math.max(
          Math.min(
            elementDimensions.left - popupPadding,
            window.innerWidth -
              popupDimensions.realWidth -
              popupArrowDimensions.width
          ),
          popupArrowDimensions.width
        );
      }

      if (alignment === "end") {
        return Math.max(
          Math.min(
            elementDimensions.left -
              popupDimensions?.realWidth +
              elementDimensions.width +
              popupPadding,
            window.innerWidth -
              popupDimensions?.realWidth -
              popupArrowDimensions.width
          ),
          popupArrowDimensions.width
        );
      }

      if (alignment === "center") {
        return Math.max(
          Math.min(
            elementDimensions.left +
              elementDimensions.width / 2 -
              popupDimensions?.realWidth / 2,
            window.innerWidth -
              popupDimensions?.realWidth -
              popupArrowDimensions.width
          ),
          popupArrowDimensions.width
        );
      }

      return 0;
    }

    calculateTopForLeftRight(alignment, config) {
      const {
        elementDimensions,
        popupDimensions,
        popupPadding,
        popupArrowDimensions,
      } = config;

      if (alignment === "start") {
        return Math.max(
          Math.min(
            elementDimensions.top - popupPadding,
            window.innerHeight -
              popupDimensions.realHeight -
              popupArrowDimensions.width
          ),
          popupArrowDimensions.width
        );
      }

      if (alignment === "end") {
        return Math.max(
          Math.min(
            elementDimensions.top -
              popupDimensions?.realHeight +
              elementDimensions.height +
              popupPadding,
            window.innerHeight -
              popupDimensions?.realHeight -
              popupArrowDimensions.width
          ),
          popupArrowDimensions.width
        );
      }

      if (alignment === "center") {
        return Math.max(
          Math.min(
            elementDimensions.top +
              elementDimensions.height / 2 -
              popupDimensions?.realHeight / 2,
            window.innerHeight -
              popupDimensions?.realHeight -
              popupArrowDimensions.width
          ),
          popupArrowDimensions.width
        );
      }

      return 0;
    }

    destroyTour() {
      let popup = this.options.popup;
      const overlaySvg = document.querySelector(".zt-tour-overlay");

      if (popup.wrapper) {
        popup.wrapper.remove();
      }
      if (overlaySvg) {
        overlaySvg.remove();
      }

      this.options.activeStagePosition = null;
      this.options.overlaySvg = null;
      this.destroyEvents();
    }

    transitionStage(timeDiff, duration, from, to) {
      let activeStagePosition = this.getOption("activeStagePosition");

      const fromDefinition = activeStagePosition
        ? activeStagePosition
        : from.getBoundingClientRect();
      const toDefinition = to.getBoundingClientRect();

      const x = this.easeInOutQuad(
        timeDiff,
        fromDefinition.x,
        toDefinition.x - fromDefinition.x,
        duration
      );
      const y = this.easeInOutQuad(
        timeDiff,
        fromDefinition.y,
        toDefinition.y - fromDefinition.y,
        duration
      );
      const width = this.easeInOutQuad(
        timeDiff,
        fromDefinition.width,
        toDefinition.width - fromDefinition.width,
        duration
      );
      const height = this.easeInOutQuad(
        timeDiff,
        fromDefinition.height,
        toDefinition.height - fromDefinition.height,
        duration
      );

      activeStagePosition = {
        x,
        y,
        width,
        height,
      };

      this.renderOverlay(activeStagePosition);
      this.setOption("activeStagePosition", activeStagePosition);
    }

    renderOverlay(stagePosition) {
      const overlaySvg = this.getOption("overlaySvg");
      if (!overlaySvg) {
        this.addOverlay(stagePosition);
        return;
      }

      const pathElement = overlaySvg.firstElementChild;
      if (pathElement?.tagName !== "path") {
        throw new Error("no path element found in stage svg");
      }

      pathElement.setAttribute(
        "d",
        this.generateStageSvgPathString(stagePosition)
      );
    }

    changeHighlight(toElement, toStep, toStepIndex) {
      const duration = this.getOption("animationDuration");
      let currentStepEle =
        this.options.steps[this.options.currentStep]?.element;

      const start = Date.now();

      const fromElement = currentStepEle
        ? document.querySelector(currentStepEle)
        : toElement;

      const isFirstHighlight = !fromElement || fromElement === toElement;

      const isAnimatedTour = this.getOption("animate");

      const hasDelayedPopup = !isFirstHighlight && isAnimatedTour;
      let isPopupRendered = false;

      this.hidePopup();

      this.setOption("currentStep", toStepIndex);

      const animate = () => {
        const timeDiff = Date.now() - start;
        const timeRemaining = duration - timeDiff;
        const isHalfwayThrough = timeRemaining <= duration / 2;
        if (
          toStep.popup &&
          isHalfwayThrough &&
          !isPopupRendered &&
          hasDelayedPopup
        ) {
          this.renderPopup(toElement, toStep);
          isPopupRendered = true;
        }

        if (this.getOption("animate") && timeDiff < duration) {
          this.transitionStage(timeDiff, duration, fromElement, toElement);
        } else {
          this.trackActiveElement(toElement);
        }
        if (timeRemaining >= 0 && this.getOption("animate")) {
          window.requestAnimationFrame(animate);
        }
      };

      window.requestAnimationFrame(animate);

      this.bringInView(toElement);
      if (!hasDelayedPopup && toStep.popup) {
        this.renderPopup(toElement, toStep);
      }
    }

    bringInView(element) {
      if (!element || this.isElementInView(element)) {
        return;
      }

      const shouldSmoothScroll = this.getOption("smoothScroll");

      element.scrollIntoView({
        behavior:
          !shouldSmoothScroll || this.isScrollableParent(element)
            ? "auto"
            : "smooth",
        inline: "center",
        block: "center",
      });
    }

    isElementInView(element) {
      const rect = element.getBoundingClientRect();

      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
          (window.innerWidth || document.documentElement.clientWidth)
      );
    }

    isScrollableParent(e) {
      if (!e || !e.parentElement) {
        return;
      }
      const parent = e.parentElement;
      return parent.scrollHeight > parent.clientHeight;
    }

    trackActiveElement(element) {
      if (!element) {
        return;
      }

      const definition = element.getBoundingClientRect();

      const activeStagePosition = {
        x: definition.x,
        y: definition.y,
        width: definition.width,
        height: definition.height,
      };

      this.setOption("activeStagePosition", activeStagePosition);

      this.renderOverlay(activeStagePosition);
    }

    addOverlay(stagePosition) {
      const overlaySvg = this.createOverlaySvg(stagePosition);
      document.body.appendChild(overlaySvg);

      this.setOption("overlaySvg", overlaySvg);
    }

    easeInOutQuad(timeDiff, initialValue, amountOfChange, duration) {
      if ((timeDiff /= duration / 2) < 1) {
        return (amountOfChange / 2) * timeDiff * timeDiff + initialValue;
      }
      return (
        (-amountOfChange / 2) * (--timeDiff * (timeDiff - 2) - 1) + initialValue
      );
    }

    refreshOverlay() {
      const activeStagePosition = this.getOption("activeStagePosition");
      const overlaySvg = this.getOption("overlaySvg");

      if (!activeStagePosition) {
        return;
      }

      if (!overlaySvg) {
        console.warn("No svg found.");
        return;
      }

      const windowX = window.innerWidth;
      const windowY = window.innerHeight;

      overlaySvg.setAttribute("viewBox", `0 0 ${windowX} ${windowY}`);
    }

    refreshStep() {
      const currentStep = this.getOption("currentStep");
      const step = this.getOption("steps")[currentStep];
      const element = document.querySelector(step.element);
      this.trackActiveElement(element);
      this.refreshOverlay();
      this.repositionPopup(element, step);
    }

    addDummyElement() {
      const isDummyElement = document.getElementById("zt-popup-dummy-element");
      if (isDummyElement) {
        return isDummyElement;
      }

      let element = document.createElement("div");

      element.id = "zt-popup-dummy-element";
      element.style.width = "0";
      element.style.height = "0";
      element.style.pointerEvents = "none";
      element.style.opacity = "0";
      element.style.position = "fixed";
      element.style.top = "50%";
      element.style.left = "50%";

      document.body.appendChild(element);

      return element;
    }
    //
  }

  global.ztTour = ztTour;
})(this);
