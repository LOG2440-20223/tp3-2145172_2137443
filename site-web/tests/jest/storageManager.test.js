import songs from "../../src/assets/js/songs";
import playlists from "../../src/assets/js/playlists";
import StorageManager from "../../src/assets/js/storageManager.js";

describe("StorageManager tests", () => {
  const assignMock = jest.fn();
  const clearHTML = () => (document.body.innerHTML = "");
  let storageManager;

  const setUpHTML = () => {};

  beforeEach(() => {
    delete window.location;
    window.location = { assign: assignMock };
    setUpHTML();
    storageManager = new StorageManager();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    assignMock.mockClear();
    clearHTML();
    localStorage.clear();
  });

  it("Storage manager should be created", () => {
    expect(storageManager).not.toEqual(null);
  });

  it("loadAllData should correctly call loadDataFromFile for both files", () => {
    const storageManagerLoadDataFromFileSpy = jest.spyOn(storageManager, 'loadDataFromFile').mockImplementation(() => {});
    storageManager.loadAllData();
    expect(storageManagerLoadDataFromFileSpy).toHaveBeenCalledTimes(2);
    const expectedStorageKeySong = "songs";
    const expectedStorageKeyPlaylists = "playlist";
    expect(storageManagerLoadDataFromFileSpy).toHaveBeenCalledWith(expectedStorageKeySong, songs);
    expect(storageManagerLoadDataFromFileSpy).toHaveBeenCalledWith(expectedStorageKeyPlaylists, playlists);
  });

  it("loadDataFromFile should not reload data if data is already contained in localStorage", () => {
    const defaultKey = "key";
    localStorage.setItem(defaultKey, JSON.stringify(defaultKey));
    const localStorageGetItemSpy = jest.spyOn(localStorage.__proto__, 'getItem');
    const localStorageSetItemSpy = jest.spyOn(localStorage.__proto__, 'setItem');
    storageManager.loadDataFromFile(defaultKey);
    expect(JSON.parse(localStorage.getItem(defaultKey))).toEqual(defaultKey);
    expect(localStorageGetItemSpy).toBeCalled();
    expect(localStorageGetItemSpy).toHaveBeenCalledWith(defaultKey);
    expect(localStorageSetItemSpy).not.toBeCalled();
  });

  it("loadDataFromFile should load data if data is not already contained in localStorage", () => {
    const defaultKey = "key";
    localStorage.setItem(defaultKey, JSON.stringify(defaultKey));
    jest.spyOn(localStorage.__proto__, 'getItem');
    jest.spyOn(localStorage.__proto__, 'setItem');
    storageManager.loadDataFromFile(defaultKey);
    expect(JSON.parse(localStorage.getItem(defaultKey))).toEqual(defaultKey);
  });

  it("getData should not get localStorage's data given an invalid storageKey", () => {
    expect(storageManager.getData(undefined)).toBeFalsy();
  });

  it("getData should get localStorage's data given a valid storageKey", () => {
    const defaultKey = "key";
    localStorage.setItem(defaultKey, JSON.stringify(defaultKey));
    jest.spyOn(localStorage.__proto__, 'getItem');
    expect(storageManager.getData(defaultKey)).toEqual(defaultKey);
  });

  it("getItemById should call getData", () => {
    const defaultKey = "key";
    const storageManagerGetDataSpy = jest.spyOn(storageManager, 'getData').mockImplementation(() => []);
    storageManager.getItemById(defaultKey, undefined);
    expect(storageManagerGetDataSpy).toBeCalled();
    expect(storageManagerGetDataSpy).toHaveBeenCalledWith(defaultKey);
  });

  it("getItemById should find item with specific id", () => {
    const elementName = "elementName";
    const expectedId = 0;
    const defaultKey = "key";
    const storageManagerGetItemByIdSpy = jest.spyOn(storageManager, 'getData').mockImplementation(() => [{ name: elementName, id: expectedId }]);
    expect(storageManager.getItemById(defaultKey, expectedId).name).toEqual(elementName);
  });

  it("addItem should correctly add an item to localStorage", () => {
    const storageKey = null;
    const newItem = undefined;
    const localStorageGetItemSpy = jest.spyOn(localStorage.__proto__, 'getItem').mockImplementation(() => JSON.stringify([{ newItem }]));
    const localStorageSetItemSpy = jest.spyOn(localStorage.__proto__, 'setItem').mockImplementation(() => {});
    storageManager.addItem(storageKey, newItem);
    expect(localStorageGetItemSpy).toBeCalled();
    expect(localStorageGetItemSpy).toHaveBeenCalledWith(storageKey);
    expect(localStorageSetItemSpy).toBeCalled();
    expect(localStorageSetItemSpy).toHaveBeenCalledWith(storageKey, JSON.stringify([{ newItem }, storageKey]));
  });

  it("replaceItem should correctly replace an item in localStorage with id checks", () => {
    // TODO
    // FIXME:
    const newElementName = "newElementName";
    const expectedId = 0;
    const defaultKey = "key";
    jest.spyOn(storageManager, 'replaceItem').mockImplementation(() => [{ name: newElementName, id: expectedId }]);
    expect(storageManager.getItemById(defaultKey, expectedId).name).toEqual(newElementName);
  });

  it("replaceItem should call getItem & setItem", () => {
    const storageKey = null;
    const newItem = undefined;
    const localStorageGetItemSpy = jest.spyOn(localStorage.__proto__, 'getItem').mockImplementation(() => JSON.stringify([]));
    const localStorageSetItemSpy = jest.spyOn(localStorage.__proto__, 'setItem').mockImplementation(() => {});
    storageManager.replaceItem(storageKey, newItem);
    expect(localStorageGetItemSpy).toBeCalled();
    expect(localStorageSetItemSpy).toBeCalled();
  });

  it("getIdFromName should call getData", () => {
    const storageKey = null;
    const storageManagerGetDataSpy = jest.spyOn(storageManager, 'getData').mockImplementation(() => []);
    storageManager.getIdFromName(storageKey, undefined);
    expect(storageManagerGetDataSpy).toBeCalled();
    expect(storageManagerGetDataSpy).toHaveBeenCalledWith(storageKey);
  });

  it("getIdFromName should return a valid id given a valid elementName", () => {
    const elementName = "elementName";
    const expectedId = 0;
    jest.spyOn(storageManager, 'getData').mockImplementation(() => [{ name: elementName, id: expectedId }]);
    expect(storageManager.getIdFromName("key", elementName)).toEqual(expectedId);
  });

  it("getIdFromName should return -1 given an invalid elementName", () => {
    const elementName = "elementName";
    const expectedId = 0;
    jest.spyOn(storageManager, 'getData').mockImplementation(() => [{ name: elementName, id: expectedId }]);
    expect(storageManager.getIdFromName("key", "papaya")).toEqual(-1);
  });

  it("resetAllData should reset localStorage", () => {
    const storageKey = "key";
    const data = { id: undefined };
    localStorage.setItem(storageKey, JSON.stringify(data));
    storageManager.resetAllData();
    const result = JSON.parse(localStorage.getItem(storageKey));
    expect(result).toEqual(null);
  });
});
