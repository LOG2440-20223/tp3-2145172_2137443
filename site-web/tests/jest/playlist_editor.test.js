import { jest } from "@jest/globals";
import PlayListEditor from "../../src/assets/js/playlist_editor";
import StorageManager from "../../src/assets/js/storageManager";

describe("Playlist Editor tests", () => {
  const assignMock = jest.fn();
  const clearHTML = () => (document.body.innerHTML = "");
  global.URL.createObjectURL = jest.fn();
  let playListEditor;
  let songStubs;

  const setUpHTML = () => {
    const playListForm = document.createElement("form");
    playListForm.setAttribute("id", "playlist-form");
    document.body.appendChild(playListForm);

    const imageDisplay = document.createElement("img");
    imageDisplay.setAttribute("id", "image-preview");
    imageDisplay.setAttribute("src", "");
    document.body.appendChild(imageDisplay);

    const songContainer = document.createElement("div");
    songContainer.setAttribute("id", "song-list");
    document.body.appendChild(songContainer);

    const inputContainer = document.createElement("div");
    songContainer.appendChild(inputContainer);
    inputContainer.appendChild(document.createElement("label"));

    const songInput = document.createElement("input");
    songInput.type = "select";
    songInput.value = "Whip";
    songInput.setAttribute("class", "song-input");
    inputContainer.appendChild(songInput);

    const imageInput = document.createElement("input");
    imageInput.setAttribute("id", "image");
    document.body.appendChild(imageInput);

    const fieldset = document.createElement("fieldset");
    fieldset.setAttribute("class", "form-control");
    const leg = document.createElement("legend");
    const texte = document.createTextNode("Chansons");
    leg.appendChild(texte);
    const dataList = document.createElement("datalist");
    dataList.setAttribute("id", "song-dataList");
    const option1 = document.createElement("option");
    option1.setAttribute("value", "Whip");
    dataList.appendChild(option1);
    const option2 = document.createElement("option");
    option2.setAttribute("value", "Overflow");
    dataList.appendChild(option2);
    const option3 = document.createElement("option");
    option3.setAttribute("value", "Intrigue Fun");
    dataList.appendChild(option3);
    const option4 = document.createElement("option");
    option4.setAttribute("value", "Bounce");
    dataList.appendChild(option4);
    const option5 = document.createElement("option");
    option5.setAttribute("value", "Summer Pranks");
    dataList.appendChild(option5);
    fieldset.appendChild(dataList);
    document.body.appendChild(fieldset);
    const addSongBtn = document.createElement("button");
    addSongBtn.id = "add-song-btn";
    addSongBtn.className = "fa fa-plus";
    document.body.appendChild(addSongBtn);
  };

  beforeEach(() => {
    delete window.location;
    window.location = {
      assign: () => ({
        href: "",
      }),
    };
    setUpHTML();
    playListEditor = new PlayListEditor(new StorageManager());
    songStubs = [
      { name: "Whip" },
      { name: "Overflow" },
      { name: "Intrigue Fun" },
      { name: "Bounce" },
      { name: "Summer Pranks" },
    ];
  });

  afterEach(() => {
    jest.restoreAllMocks();
    assignMock.mockClear();
    clearHTML();
  });

  it("buildDataList should correctly build data list", () => {
    const dataListContainer = document.createElement("datalist");
    playListEditor.buildDataList(dataListContainer, songStubs);
    const childrenElements = dataListContainer.children;
    for (let i = 0; i < childrenElements.length; i++) {
      expect(childrenElements[i].tagName).toEqual("OPTION");
      expect(childrenElements[i].value).toEqual(songStubs[i].name);
    }
    expect(dataListContainer.childElementCount).toEqual(songStubs.length);
  });

  it("updateImageDisplay should update image display", () => {
    playListEditor.files = songStubs;
    playListEditor.updateImageDisplay();
    const imagePreview = document.getElementById("image-preview");
    expect(imagePreview.src).not.toEqual("");
  });

  it("addItemSelect should call preventDefault for events", () => {
    const randomEvent = new Event("");
    const randomEventPreventDefaultSpy = jest.spyOn(randomEvent, "preventDefault").mockImplementation(() => {});
    playListEditor.addItemSelect(randomEvent);
    expect(randomEventPreventDefaultSpy).toBeCalled();
  });

  it("addItemSelect should correctly add item to container", () => {
    // TODO
    const songContainer = document.getElementById("song-list");
    const count = songContainer.children.length + 1;
    const addItemEvent = new Event("");
    playListEditor.addItemSelect(addItemEvent);
    expect(songContainer.children.length).toEqual(count);
  });

  it("addItemSelect should remove event target's parent node upon clicked", () => {
    // TODO
    const parent = document.getElementById("song-2");
    expect(parent).toBeFalsy();
  });

  it("load should call StorageManager.loadAllData & .buildDataList and buildDataList", () => {
    const playListEditorStorageManagerLoadAllDataSpy = jest
      .spyOn(playListEditor.storageManager, "loadAllData")
      .mockImplementation(() => {});
    const playListEditorStorageManagerGetDataSpy = jest
      .spyOn(playListEditor.storageManager, "getData")
      .mockImplementation(() => {});
    const playListEditorBuildDataListSpy = jest.spyOn(playListEditor, "buildDataList").mockImplementation(() => {});
    jest.spyOn(playListEditor, "updateImageDisplay").mockImplementation(() => {});
    jest.spyOn(playListEditor, "addItemSelect").mockImplementation(() => {});
    // TODO compléter le test après la configuration
    playListEditor.load();
    expect(playListEditorStorageManagerLoadAllDataSpy).toHaveBeenCalled();
    expect(playListEditorStorageManagerGetDataSpy).toHaveBeenCalled();
    expect(playListEditorBuildDataListSpy).toHaveBeenCalled();
  });

  it("load should correctly add updateImageDisplay as eventListener on change event to image input", () => {
    // TODO
    const image = document.getElementById("image");
    jest.spyOn(image, "addEventListener").mockImplementation(() => { });
    playListEditor.load();
    expect(image.addEventListener).toHaveBeenCalledWith("change", playListEditor.updateImageDisplay)
  });

  it("load should correctly add addItemSelect as eventListener on click event to add song button", () => {
    // TODO
    const buttonClicked = new Event("click");
    const addSongButton = document.getElementById("add-song-btn");
    const addItemSelectedSpy = jest.spyOn(playListEditor, "addItemSelect").mockImplementation(() => { });
    playListEditor.load();
    addSongButton.dispatchEvent(buttonClicked);
    expect(addItemSelectedSpy).toHaveBeenCalled();
  });

  it("load should correctly call createPlaylist and preventDefault on submit event to the form", () => {
    // TODO
    const form = document.getElementById("playlist-form");
    const submitEvent = new Event("submit");
    const createPlaylistSpy = jest.spyOn(playListEditor, "createPlaylist").mockImplementation(async () => { });
    const preventDefaultSpy = jest.spyOn(submitEvent, "preventDefault").mockImplementation(() => { });
    playListEditor.load();
    form.dispatchEvent(submitEvent);
    expect(createPlaylistSpy).toHaveBeenCalledWith(form);
    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(location.href).toEqual("index.html");
  });

  it("createPlaylist should correctly call getImageInput, StorageManager.getIdFromName & StorageManager.addItem", async () => {
    const playListEditorGetImageInputSpy = jest.spyOn(playListEditor, "getImageInput").mockImplementation(() => {});
    const playListEditorStorageManagerGetIdFromNameSpy = jest
      .spyOn(playListEditor.storageManager, "getIdFromName")
      .mockImplementation(() => null);
    const playListEditorStorageManagerAddItemSpy = jest
      .spyOn(playListEditor.storageManager, "addItem")
      .mockImplementation(() => {});
    const form = document.getElementById("playlist-form");
    jest.spyOn(form, "elements", "get").mockReturnValue({ name: "", description: "" });
    await playListEditor.createPlaylist(form, () => 0);
    expect(playListEditorGetImageInputSpy).toBeCalled();
    expect(playListEditorStorageManagerGetIdFromNameSpy).toBeCalled();
    expect(playListEditorStorageManagerAddItemSpy).toBeCalled();
  });

  it("getImageInput should not return an image for invalid inputs", async () => {
    expect(playListEditor.getImageInput(undefined)).toEqual(Promise.resolve());
  });

  it("getImageInput should return an image for a valid input", async () => {
    const mockFileInput = { files: [new Blob()] };
    const image = await playListEditor.getImageInput(mockFileInput);
    expect(image).toBeTruthy();
  });

  it("getImageInput should call readAsDataURL on the first file of the input", async () => {
    const spy = jest.spyOn(FileReader.prototype, "readAsDataURL");
    const mockFileInput = { files: [new Blob()] };
    await playListEditor.getImageInput(mockFileInput);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(mockFileInput.files[0]);
  });
});
