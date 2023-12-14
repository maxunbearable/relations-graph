let itemsCount = 1000;
document.addEventListener("DOMContentLoaded", function () {
  const formContainer = document.getElementById("form-container");

  for (let i = 1; i <= 1000; i++) {
    addFormItem(i, formContainer);
  }

  makeConnections();
});

const offset = 50; // Define your offset value

function connectElements(elementId, targetElementId, secondConnection = false) {
  const svg = document.getElementById("container");
  const targetElement = document.getElementById(targetElementId);
  const element = document.getElementById(elementId);

  if (targetElement && element) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    const current = element.getBoundingClientRect();
    const target = targetElement.getBoundingClientRect();

    const currentX = secondConnection
      ? current.left + current.width / 2 + offset
      : current.left + current.width / 2 - offset;
    const currentY = current.top + current.height / 2;
    const targetX = target.left + target.width / 2;
    const targetY = target.top + target.height / 2;

    const isVerticalAlignment =
      target.left >= current.left && target.right <= current.right;

    if (isVerticalAlignment) {
      const x1 = targetX;
      const y1 = currentY;
      const x2 = targetX;
      const y2 = targetY > currentY ? target.top : target.bottom;

      drawLine(
        svg,
        line,
        x1,
        y1 + current.height / 2.5,
        x2,
        y2 - current.height / 4,
        true
      );
    } else {
      const verticalX = currentX;
      const verticalY1 = Math.min(currentY, targetY) + current.height / 2.5;
      const verticalY2 =
        Math.max(currentY, targetY) - target.height / 2 - offset;

      const horizontalX1 = currentX;
      const horizontalX2 =
        targetX > currentX
          ? target.left + target.width / 2
          : target.right - target.width / 2;
      const horizontalY = targetY - target.height / 2 - offset;

      const verticalLine = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      const horizontalLine = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      const verticalLine2 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );

      drawLine(
        svg,
        verticalLine,
        verticalX,
        verticalY1,
        verticalX,
        verticalY2,
        false
      );
      drawLine(
        svg,
        horizontalLine,
        horizontalX1,
        horizontalY,
        horizontalX2,
        horizontalY,
        false
      );

      const button = document.createElement("button");
      button.textContent = "And/Or";
      button.classList.add("joint-button");
      document.body.appendChild(button);
      button.style.borderRadius = "15%";
      button.style.width = "55px";
      button.style.height = "30px";
      const svgRect = svg.getBoundingClientRect();
      button.style.position = "absolute";
      button.style.left = `${svgRect.left - 25 + horizontalX2}px`;
      button.style.top = `${svgRect.top - 10 + horizontalY}px`;
      drawLine(
        svg,
        verticalLine2,
        horizontalX2,
        horizontalY,
        horizontalX2,
        horizontalY + target.height / 4,
        true
      );
      targetElement.classList.add("connected");
    }
  }
}

function drawLine(svg, line, x1, y1, x2, y2, hasArrowhead) {
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  line.setAttribute("stroke", "blue");
  line.setAttribute("stroke-width", "2");
  line.setAttribute("stroke-opacity", "0.3");

  if (hasArrowhead) {
    line.setAttribute("marker-end", "url(#arrowhead)");
  }

  svg.appendChild(line);
}

function makeConnections() {
  connectElements("form1", "form5");
  connectElements("form7", "form11");

  const forms = document.querySelectorAll(".form");
  let row = 0;

  for (let i = 0; i < forms.length; i++) {
    const elementId = `form${i}`;
    const targetId = `form${i + 5}`;

    if (i !== forms.length - 1) {
      connectElements(elementId, targetId);
    }
    if ((i + 1) % 5 === 0) {
      row++;
    }
  }
}

function clearSVG() {
  const svg = document.getElementById("container");
  while (svg.firstChild) {
    svg.removeChild(svg.firstChild);
  }
}

function removeJointAllButtons() {
  const buttons = document.querySelectorAll(".joint-button");
  buttons.forEach((button) => {
    button.remove();
  });
}

function addFormItem(i, formContainer, munuallyAdded = false) {
  const form = document.createElement("form");
  form.setAttribute("id", `form${i}`);
  form.setAttribute("class", "form");

  const span = document.createElement("span");
  span.style.width = "calc(100% - 10px)";
  span.textContent = `Form - ${i}`;
  form.appendChild(span);
  const input = document.createElement("input");
  input.style.width = "calc(100% - 10px)";
  input.setAttribute("type", "text");
  form.appendChild(input);
  const button = document.createElement("button");
  button.type = "button";
  button.style.width = "calc(100% - 10px)";
  button.textContent = `Add Form and Redraw`;
  button.addEventListener("click", onAddFormItem);
  form.appendChild(button);

  if (munuallyAdded) {
    const forms = formContainer.querySelectorAll(".form");
    const referenceNode = forms[7].nextSibling;
    formContainer.insertBefore(form, referenceNode);
  } else {
    formContainer.appendChild(form);
  }
}

function redrawAll() {
  clearSVG();
  removeJointAllButtons();

  makeConnections();
}

function onAddFormItem() {
  itemsCount++;
  const formContainer = document.getElementById("form-container");
  addFormItem(itemsCount, formContainer, true);
  redrawAll();
}

window.addEventListener("resize", redrawAll);
