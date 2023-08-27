const btnNew = document.getElementById("btnNew");
const trNewRow = document.getElementById("trNewRow");
const ddlGender = document.getElementById("ddlGender");
const ddlNationality = document.getElementById("ddlNationality");
const ddlPosition = document.getElementById("ddlPosition");
const tblData = document.getElementById("tblData");
const tBody = tblData.getElementsByTagName("tbody")[0];
const txtId = document.getElementById("txtId");
const txtFirstName = document.getElementById("txtFirstName");
const txtLastName = document.getElementById("txtLastName");
const txtPatronymic = document.getElementById("txtPatronymic");
const txtSalary = document.getElementById("txtSalary");
const txtSearch = document.getElementById("txtSearch");
const ddlSort = document.getElementById("ddlSort");
const ddlSortOrder = document.getElementById("ddlSortOrder");
let isOpenedState = false;
const itemsPerPage = 10; 
let currentPage = 1;

const showErrorMessage = (msg) => {
  swal("Warning", msg, "warning");
};

const showSucccesMessage = (msg) => {
  swal("Success", msg, "success");
};

const generateSelect = (slct, data, textFieldName, valueFieldName) => {
  let initialOption = document.createElement("option");
  initialOption.text = "";
  initialOption.value = -1;
  slct.appendChild(initialOption);
  data.forEach((row) => {
    let option = document.createElement("option");
    option.text = row[textFieldName];
    option.value = row[valueFieldName];
    slct.appendChild(option);
  });
};

const generateAllSelects = () => {
  generateSelect(ddlGender, fakeData[0].genderData, "name", "id");
  generateSelect(ddlPosition, fakeData[0].positionData, "name", "id");
  generateSelect(ddlNationality, fakeData[0].nationalityData, "name", "id");
};

const generateAllCellsForTable = () => {
  const tdSave = document.createElement("td");
  const tdRemove = document.createElement("td");
  const tdId = document.createElement("td");
  const tdFirstName = document.createElement("td");
  const tdLastName = document.createElement("td");
  const tdPatronymic = document.createElement("td");
  const tdGender = document.createElement("td");
  const tdNationality = document.createElement("td");
  const tdPosition = document.createElement("td");
  const tdSalary = document.createElement("td");

  return {
    tdSave,
    tdRemove,
    tdId,
    tdFirstName,
    tdLastName,
    tdPatronymic,
    tdGender,
    tdNationality,
    tdPosition,
    tdSalary,
  };
};

const generateIcons = (className, eventHandler, isHiddenIcon) => {
  let icon = document.createElement("i");
  icon.className = className;
  icon.addEventListener("click", eventHandler);

  if (isHiddenIcon) {
    icon.classList.add("invisibl");
  }
  return icon;
};

const generateElements = (elem, data, dataTextName, type, selectData) => {
  let element = document.createElement(elem);
  let nodeName = element.nodeName.toLowerCase();
  if (data.isDeletedState == false) {
    switch (nodeName) {
      case elementTypes.input:
        element.className = "form-control";
        if (type === "text") {
          element.classList.add("invisibl");
        }

        if (type === "hidden") {
          element.value = data[dataTextName];
        }

        element.type = type;

        break;
      case elementTypes.select:
        element.className = "form-select invisibl";
        generateSelect(
          element,
          selectData.data,
          selectData.text,
          selectData.value
        );
        break;
      case elementTypes.span:
        element.textContent = data[dataTextName];
        break;
      default:
        break;
    }
  } else {
    switch (nodeName) {
      case elementTypes.input:
        element.className = "form-control";
        if (type === "text") {
          element.classList.add("invisibl");
          element.classList.add("deletedRow");
        }

        if (type === "hidden") {
          element.value = data[dataTextName];
        }

        element.type = type;

        break;
      case elementTypes.select:
        element.className = "form-select invisibl deletedRow";
        generateSelect(
          element,
          selectData.data,
          selectData.text,
          selectData.value
        );
        break;
      case elementTypes.span:
        element.textContent = data[dataTextName];
        element.classList.add("deletedRow");
        break;
      default:
        break;
    }
  }

  return element;
};

const tryConvertModelForNewRow = () => {
  let id = txtId.value;
  let firstName = txtFirstName.value;
  let lastName = txtLastName.value;
  let patronymic = txtPatronymic.value;
  let salary = txtSalary.value;
  let genderName = ddlGender.options[ddlGender.selectedIndex].text;
  let nationalityName =
    ddlNationality.options[ddlNationality.selectedIndex].text;
  let positionName = ddlPosition.options[ddlPosition.selectedIndex].text;

  if (
    ddlGender.value == -1 ||
    ddlNationality.value == -1 ||
    ddlPosition.value == -1
  ) {
    showErrorMessage("Select areas must be selected");
    return {
      data: {},
      success: false,
    };
  }

  return {
    data: {
      id: id,
      firstName: firstName,
      lastName: lastName,
      patronymic: patronymic,
      gender: genderName,
      nationality: nationalityName,
      position: positionName,
      salary: salary,
    },
    success: true,
  };
};

const clearNewRow = () => {
  txtId.value = "";
  txtFirstName.value = "";
  txtLastName.value = "";
  txtPatronymic.value = "";
  txtSalary.value = "";

  ddlGender.selectedIndex = -1;
  ddlPosition.selectedIndex = -1;
  ddlNationality.selectedIndex = -1;
};

const saveNewRow = () => {
  const rowForPush = tryConvertModelForNewRow();
  if (rowForPush.success) {
    fakeData[0].mainData.push(rowForPush);
    hideNewRow();
    clearNewRow();
    renderTable(fakeData[0].mainData);
  }
  isOpenedState = false;
};

const saveEditedRow = (e) => {
  let tr = e.target.closest("tr");

  let id = tr.cells[2].children[1].value;
  let firstName = tr.cells[3].children[1].value;
  let lastName = tr.cells[4].children[1].value;
  let patronymic = tr.cells[5].children[1].value;
  let gender = tr.cells[6].children[2].value;
  let nation = tr.cells[7].children[2].value;
  let position = tr.cells[8].children[2].value;
  let salary = tr.cells[9].children[1].value;

  let existingRow = fakeData[0].mainData.find((x) => x.id == id);
  existingRow.firstName = firstName;
  existingRow.lastName = lastName;
  existingRow.patronymic = patronymic;
  existingRow.gender = gender;
  existingRow.nationality = nation;
  existingRow.position = position;
  existingRow.salary = salary;

  renderTable(fakeData[0].mainData);
  isOpenedState = false;
};

const showEditRow = (e) => {
  if (isOpenedState) {
    showErrorMessage("The last changes are not completed");
    return;
  }

  let tr = e.target.closest("tr");

  // change Icons section
  tr.cells[0].children[1].classList.add("invisibl");
  tr.cells[0].children[0].classList.remove("invisibl");

  tr.cells[1].children[1].classList.add("invisibl");
  tr.cells[1].children[0].classList.remove("invisibl");

  // change Id section
  let spId = tr.cells[2].children[0];
  let inpId = tr.cells[2].children[1];

  inpId.value = spId.textContent;
  spId.classList.add("invisibl");
  inpId.classList.remove("invisibl");

  // changeFirstName Section

  let spFirstName = tr.cells[3].children[0];
  let inpFirstName = tr.cells[3].children[1];

  inpFirstName.value = spFirstName.textContent;
  spFirstName.classList.add("invisibl");
  inpFirstName.classList.remove("invisibl");

  // changeLastName Section

  let spLastName = tr.cells[4].children[0];
  let inpLastName = tr.cells[4].children[1];

  inpLastName.value = spLastName.textContent;
  spLastName.classList.add("invisibl");
  inpLastName.classList.remove("invisibl");

  // changePatronymic Section

  let spPatronymic = tr.cells[5].children[0];
  let inpPatronymic = tr.cells[5].children[1];

  inpPatronymic.value = spPatronymic.textContent;
  spPatronymic.classList.add("invisibl");
  inpPatronymic.classList.remove("invisibl");

  // changeGenderSection
  let spGender = tr.cells[6].children[0];
  let ddlGender = tr.cells[6].children[1];
  let inpGender = tr.cells[6].children[2];

  ddlGender.value = inpGender.value;
  ddlGender.classList.remove("invisibl");
  spGender.classList.add("invisibl");

  // changeNationalitySection
  let spNation = tr.cells[7].children[0];
  let ddlNation = tr.cells[7].children[1];
  let inpNation = tr.cells[7].children[2];

  ddlNation.value = inpNation.value;
  ddlNation.classList.remove("invisibl");
  spNation.classList.add("invisibl");

  // changePosition Section
  let spPos = tr.cells[8].children[0];
  let ddlPos = tr.cells[8].children[1];
  let inpPos = tr.cells[8].children[2];

  ddlPos.value = inpPos.value;
  ddlPos.classList.remove("invisibl");
  spPos.classList.add("invisibl");

  // changeSalary Section

  let spSalary = tr.cells[9].children[0];
  let inpSalary = tr.cells[9].children[1];

  inpSalary.value = spSalary.textContent;
  spSalary.classList.add("invisibl");
  inpSalary.classList.remove("invisibl");

  isOpenedState = true;
};

const revertDeletedRow = (e) => {
  if (isOpenedState) {
    showErrorMessage("The last changes are not completed");
    return;
  }

  let tr = e.target.closest("tr");
  let id = parseInt(tr.cells[2].children[0].textContent);
  let existingRow = fakeData[0].mainData.find((x) => x.id == id);
  existingRow.isDeletedState = false;
  renderTable(fakeData[0].mainData);
  
};

const deleteRow = (e) => {
  if (isOpenedState) {
    showErrorMessage("The last changes are not completed");
    return;
  }
  let tr = e.target.closest("tr");
  let id = parseInt(tr.cells[2].children[0].textContent);
  let existingRow = fakeData[0].mainData.find((x) => x.id == id);
  existingRow.isDeletedState = true;
  renderTable(fakeData[0].mainData);
};

const undoRow = (e) => {
  let tr = e.target.closest("tr");

  // change Icons section
  tr.cells[0].children[1].classList.remove("invisibl");
  tr.cells[0].children[0].classList.add("invisibl");

  tr.cells[1].children[1].classList.remove("invisibl");
  tr.cells[1].children[0].classList.add("invisibl");

  // change Id section
  let spId = tr.cells[2].children[0];
  let inpId = tr.cells[2].children[1];

  spId.classList.remove("invisibl");
  inpId.classList.add("invisibl");

  // changeFirstName Section

  let spFirstName = tr.cells[3].children[0];
  let inpFirstName = tr.cells[3].children[1];

  spFirstName.classList.remove("invisibl");
  inpFirstName.classList.add("invisibl");

  // changeLastName Section

  let spLastName = tr.cells[4].children[0];
  let inpLastName = tr.cells[4].children[1];

  spLastName.classList.remove("invisibl");
  inpLastName.classList.add("invisibl");

  // changePatronymic Section

  let spPatronymic = tr.cells[5].children[0];
  let inpPatronymic = tr.cells[5].children[1];

  spPatronymic.classList.remove("invisibl");
  inpPatronymic.classList.add("invisibl");

  // changeGenderSection
  let spGender = tr.cells[6].children[0];
  let ddlGender = tr.cells[6].children[1];

  ddlGender.classList.add("invisibl");
  spGender.classList.remove("invisibl");

  // changeNationalitySection
  let spNation = tr.cells[7].children[0];
  let ddlNation = tr.cells[7].children[1];

  ddlNation.classList.add("invisibl");
  spNation.classList.remove("invisibl");

  // changePosition Section
  let spPos = tr.cells[8].children[0];
  let ddlPos = tr.cells[8].children[1];

  ddlPos.classList.add("invisibl");
  spPos.classList.remove("invisibl");

  // changeSalary Section

  let spSalary = tr.cells[9].children[0];
  let inpSalary = tr.cells[9].children[1];

  spSalary.classList.remove("invisibl");
  inpSalary.classList.add("invisibl");

  isOpenedState = false;
};

const generateTr = (data) => {
  let tr = document.createElement("tr");

  const cells = generateAllCellsForTable();

  //icon section
  if (data.isDeletedState == false) {
    cells.tdSave.appendChild(
      generateIcons("fa-solid fa-save", saveEditedRow, true)
    );
    cells.tdSave.appendChild(
      generateIcons("fa-solid fa-edit", showEditRow, false)
    );

    cells.tdRemove.appendChild(generateIcons("fa-solid fa-undo", undoRow, true));
    cells.tdRemove.appendChild(
      generateIcons("fa-solid fa-trash-alt", deleteRow, false)
    );
  } else {
    cells.tdSave.appendChild(
      generateIcons("fa-solid fa-undo", revertDeletedRow, false)
    );
  }


  //id section
  cells.tdId.appendChild(
    generateElements(elementTypes.span, data, "id", "text", null)
  );
  cells.tdId.appendChild(
    generateElements(elementTypes.input, data, null, "text", null)
  );

  //firstName section
  cells.tdFirstName.appendChild(
    generateElements(elementTypes.span, data, "firstName", "text", null)
  );
  cells.tdFirstName.appendChild(
    generateElements(elementTypes.input, data, null, "text", null)
  );

  //lastName section
  cells.tdLastName.appendChild(
    generateElements(elementTypes.span, data, "lastName", "text", null)
  );
  cells.tdLastName.appendChild(
    generateElements(elementTypes.input, data, null, "text", null)
  );

  //patronymic section
  cells.tdPatronymic.appendChild(
    generateElements(elementTypes.span, data, "patronymic", "text", null)
  );
  cells.tdPatronymic.appendChild(
    generateElements(elementTypes.input, data, null, "text", null)
  );

  //gender section

  cells.tdGender.appendChild(
    generateElements(elementTypes.span, data, "gender", "", null)
  );
  cells.tdGender.appendChild(
    generateElements(elementTypes.select, data, "", "", {
      data: fakeData[0].genderData,
      text: "name",
      value: "name",
    })
  );
  cells.tdGender.appendChild(
    generateElements(elementTypes.input, data, "gender", "hidden", null)
  );

  //nationality section

  cells.tdNationality.appendChild(
    generateElements(elementTypes.span, data, "nationality", "", null)
  );
  cells.tdNationality.appendChild(
    generateElements(elementTypes.select, data, "", "", {
      data: fakeData[0].nationalityData,
      text: "name",
      value: "name",
    })
  );
  cells.tdNationality.appendChild(
    generateElements(elementTypes.input, data, "nationality", "hidden", null)
  );

  //position section

  cells.tdPosition.appendChild(
    generateElements(elementTypes.span, data, "position", "", null)
  );
  cells.tdPosition.appendChild(
    generateElements(elementTypes.select, data, "", "", {
      data: fakeData[0].positionData,
      text: "name",
      value: "name",
    })
  );
  cells.tdPosition.appendChild(
    generateElements(elementTypes.input, data, "position", "hidden", null)
  );

  //salary section
  cells.tdSalary.appendChild(
    generateElements(elementTypes.span, data, "salary", "text", null)
  );
  cells.tdSalary.appendChild(
    generateElements(elementTypes.input, data, null, "text", null)
  );

  //append all cells to tr
  tr.appendChild(cells.tdSave);
  tr.appendChild(cells.tdRemove);
  tr.appendChild(cells.tdId);
  tr.appendChild(cells.tdFirstName);
  tr.appendChild(cells.tdLastName);
  tr.appendChild(cells.tdPatronymic);
  tr.appendChild(cells.tdGender);
  tr.appendChild(cells.tdNationality);
  tr.appendChild(cells.tdPosition);
  tr.appendChild(cells.tdSalary);

  return tr;
};

const clearTableBeforeRender = () => {
  const trs = tBody.querySelectorAll("tr:not(:first-child)");
  trs.forEach((x) => x.remove());
};

const renderTable = (datas) => {
  clearTableBeforeRender();

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  datas.slice(startIndex, endIndex).forEach((data) => {
    const tr = generateTr(data);
    tBody.appendChild(tr);
  });

  renderPagination(datas.length);
};

const renderPagination = (totalItems) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginationContainer = document.getElementById("pagination");

  let paginationHTML = `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
    <a class="page-link" href="#" tabindex="-1" data-page="prev">Previous</a>
  </li>`;

  for (let i = 1; i <= totalPages; i++) {
    paginationHTML += `<li class="page-item ${currentPage === i ? 'active' : ''}">
      <a class="page-link" href="#" data-page="${i}">${i}</a>
    </li>`;
  }

  paginationHTML += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
    <a class="page-link" href="#" data-page="next">Next</a>
  </li>`;

  paginationContainer.innerHTML = paginationHTML;

  const paginationLinks = paginationContainer.querySelectorAll("a.page-link");
  paginationLinks.forEach((link) => {
    link.addEventListener("click", handlePaginationClick);
  });
};

const handlePaginationClick = (e) => {
  e.preventDefault();

  const targetPage = e.target.getAttribute("data-page");

  if (targetPage === "prev" && currentPage > 1) {
    currentPage -= 1;
  } else if (targetPage === "next" && currentPage < Math.ceil(fakeData[0].mainData.length / itemsPerPage)) {
    currentPage += 1;
  } else if (!isNaN(targetPage)) {
    currentPage = parseInt(targetPage);
  }

  renderTable(fakeData[0].mainData);
};

const showNewRow = () => {
  if (isOpenedState) {
    showErrorMessage("The last changes are not completed");
    return;
  }

  if (trNewRow.classList.contains("invisibl")) {
    trNewRow.classList.remove("invisibl");
  } else {
    showErrorMessage("The last changes are not completed");
  }

  isOpenedState = true;
};

const hideNewRow = () => {
  if (!trNewRow.classList.contains("invisibl")) {
    trNewRow.classList.add("invisibl");
  }

  isOpenedState = false;
};

const generateNoRowTr = () => {
  let tr = document.createElement("tr");
  let td = document.createElement("td");
  td.colSpan = 10;
  td.textContent = "There is no existing match for searching criteria";
  tr.appendChild(td);
  tr.classList.add("text-center");

  return tr;
};

const onFlySearch = (e) => {
  let searchValue = e.target.value;
  let data = fakeData[0].mainData.filter((x) =>
    x.firstName.includes(searchValue)
  );
  if (data.length === 0) {
    let tr = generateNoRowTr();
    clearTableBeforeRender();
    tBody.appendChild(tr);
  } else {
    renderTable(data);
  }
};

const sortData = (e) => {
  let sortField = e.target.value;
  let sortOrder = ddlSortOrder.value;

  //if sortOrder equals 1 is Ascending
  if (sortOrder == "1") {
    let sortedData = fakeData[0].mainData.sort((a, b) => {
      return a[sortField].localeCompare(b[sortField]);
    });

    renderTable(sortedData);
  } else {
    let sortedData = fakeData[0].mainData.sort((a, b) => {
      return b[sortField].localeCompare(a[sortField]);
    });

    renderTable(sortedData);
  }
};

const addEventListeners = () => {
  btnNew.addEventListener("click", showNewRow);
  trNewRow.cells[1].children[0].addEventListener("click", hideNewRow);
  trNewRow.cells[0].children[0].addEventListener("click", saveNewRow);
  txtSearch.addEventListener("keyup", onFlySearch);
  ddlSort.addEventListener("change", sortData);
};

const initPage = () => {
  addEventListeners();
  generateAllSelects();
  renderTable(fakeData[0].mainData);
  renderPagination(fakeData[0].mainData.length);
};

document.addEventListener("DOMContentLoaded", initPage);
