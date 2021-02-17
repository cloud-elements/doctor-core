/* eslint-disable no-undef */
const path = require('path');
const {equals, pluck, addIndex, map, head} = require('ramda');
const {Assets} = require('../../src/constants/artifact');
const canceledJob = require('../../src/events/cancelled-job');
const createElements = require('../../src/core/elements/createElements');
const readElementsFromDir = require('../../src/core/elements/readElementsFromDir');
const http = require('../../src/utils/http');

const mapIndex = addIndex(map);
const elementsDirectoryPath = path.resolve('./test/assets/snapshot_export_103230_2020-11-27T05_53_21/elements');
jest.mock('../../src/utils/http');
jest.mock('../../src/events/cancelled-job');

describe('createElements', () => {
  it('should be able to handle empty elements', async () => {
    const elementsData = await readElementsFromDir(elementsDirectoryPath);
    expect(elementsData).not.toBeNull();
    http.get.mockImplementation((url, qs, account) => {
      if (!equals(account, __ACCOUNT__)) {
        throw new Error('This should never happen');
      }
      if (
        equals(url, 'elements') &&
        equals(qs, {
          where: "private='true' AND abridged='true'",
        })
      ) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'bigcommerce-clone')));
      } else if (
        equals(url, 'elements') &&
        equals(qs, {
          where: "extended='true' AND abridged='true'",
        })
      ) {
        return Promise.resolve(elementsData.filter(element => !equals(element.key, 'bigcommerce-clone')));
      } else if (equals(url, 'elements/adpworkforcenow/resources')) {
        return Promise.resolve(
          head(
            pluck(
              'resources',
              elementsData.filter(element => equals(element.key, 'adpworkforcenow')),
            ),
          ),
        );
      } else if (equals(url, 'elements/actessentials/resources')) {
        return Promise.resolve(
          head(
            pluck(
              'resources',
              elementsData.filter(element => equals(element.key, 'actessentials')),
            ),
          ),
        );
      } else if (equals(url, 'elements/bigcommerce/resources')) {
        return Promise.resolve(
          head(
            pluck(
              'resources',
              elementsData.filter(element => equals(element.key, 'bigcommerce')),
            ),
          ),
        );
      } else if (equals(url, 'elements/bigcommerce-clone/resources')) {
        return Promise.resolve(
          head(
            pluck(
              'resources',
              elementsData.filter(element => equals(element.key, 'bigcommerce-clone')),
            ),
          ),
        );
      } else {
        return Promise.reject(new Error('not found'));
      }
    });
    await createElements(__ACCOUNT__, []);
  });
  it('should be able to update existing elements or resources if already exists', async () => {
    const elementsData = await readElementsFromDir(elementsDirectoryPath);
    expect(elementsData).not.toBeNull();
    http.get.mockImplementation((url, qs, account) => {
      if (!equals(account, __ACCOUNT__)) {
        throw new Error('This should never happen');
      }
      if (
        equals(url, 'elements') &&
        equals(qs, {
          where:
            "private='true' AND abridged='true' AND key in ('adpwfnSDF','adpworkforcenow','actessentials','bigcommerce','bigcommerce-clone')",
        })
      ) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'bigcommerce-clone')));
      } else if (
        equals(url, 'elements') &&
        equals(qs, {
          where:
            "extended='true' AND abridged='true' AND key in ('adpwfnSDF','adpworkforcenow','actessentials','bigcommerce','bigcommerce-clone')",
        })
      ) {
        return Promise.resolve(elementsData.filter(element => !equals(element.key, 'bigcommerce-clone')));
      } else if (equals(url, 'elements/adpworkforcenow/resources')) {
        return Promise.resolve(
          head(
            pluck(
              'resources',
              elementsData.filter(element => equals(element.key, 'adpworkforcenow')),
            ),
          ),
        );
      } else if (equals(url, 'elements/actessentials/resources')) {
        return Promise.resolve(
          head(
            pluck(
              'resources',
              elementsData.filter(element => equals(element.key, 'actessentials')),
            ),
          ),
        );
      } else if (equals(url, 'elements/bigcommerce/resources')) {
        return Promise.resolve(
          head(
            pluck(
              'resources',
              elementsData.filter(element => equals(element.key, 'bigcommerce')),
            ),
          ),
        );
      } else if (equals(url, 'elements/bigcommerce-clone/resources')) {
        return Promise.resolve(
          head(
            pluck(
              'resources',
              elementsData.filter(element => equals(element.key, 'bigcommerce-clone')),
            ),
          ),
        );
      } else {
        return Promise.reject(new Error('not found'));
      }
    });
    http.update.mockImplementation((path, body, account) => {
      if (!equals(account, __ACCOUNT__)) {
        throw new Error('This should never happen');
      }
      if (equals(path, 'elements/adpwfnSDF')) {
        return Promise.resolve(
          head(
            pluck(
              'resources',
              elementsData.filter(element => equals(element.key, 'adpwfnSDF')),
            ),
          ),
        );
      }
    });
    http.post.mockImplementation((path, body, account) => {
      if (!equals(account, __ACCOUNT__)) {
        throw new Error('This should never happen');
      }
      if (equals(path, 'elements/bigcommerce')) {
        return Promise.resolve(
          head(
            pluck(
              'resources',
              elementsData.filter(element => equals(element.key, 'bigcommerce')),
            ),
          ),
        );
      }
    });
    await createElements(__ACCOUNT__, elementsData);
    expect(http.get).toHaveBeenCalledWith(
      Assets.ELEMENTS,
      {
        where:
          "private='true' AND abridged='true' AND key in ('adpwfnSDF','adpworkforcenow','actessentials','bigcommerce','bigcommerce-clone')",
      },
      __ACCOUNT__,
    );
    expect(http.get).toHaveBeenCalledWith(
      Assets.ELEMENTS,
      {
        where:
          "extended='true' AND abridged='true' AND key in ('adpwfnSDF','adpworkforcenow','actessentials','bigcommerce','bigcommerce-clone')",
      },
      __ACCOUNT__,
    );
  });
  it("should be able to extende system element if elements doesn't exists", async () => {
    let elementsData = await readElementsFromDir(elementsDirectoryPath);
    elementsData = mapIndex((element, index) => ({...element, id: index}), elementsData);
    expect(elementsData).not.toBeNull();
    http.get.mockImplementation((url, qs, account) => {
      if (!equals(account, __ACCOUNT__)) {
        throw new Error('This should never happen');
      }
      if (
        equals(url, 'elements') &&
        equals(qs, {
          where:
            "private='true' AND abridged='true' AND key in ('adpwfnSDF','adpworkforcenow','actessentials','bigcommerce','bigcommerce-clone')",
        })
      ) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'bigcommerce-clone')));
      } else if (
        equals(url, 'elements') &&
        equals(qs, {
          where:
            "extended='true' AND abridged='true' AND key in ('adpwfnSDF','adpworkforcenow','actessentials','bigcommerce','bigcommerce-clone')",
        })
      ) {
        return Promise.resolve([]);
      } else if (equals(url, 'elements') && equals(qs, {where: "key = 'adpworkforcenow'"})) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'adpworkforcenow')));
      } else if (equals(url, 'elements') && equals(qs, {where: "key = 'actessentials'"})) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'actessentials')));
      } else if (equals(url, 'elements') && equals(qs, {where: "key = 'bigcommerce'"})) {
        return Promise.resolve(
          mapIndex(
            element => ({...element, private: false, key: 'bigcommerce'}),
            elementsData.filter(
              element => equals(element.key, 'bigcommerce') || equals(element.key, 'bigcommerce-clone'),
            ),
          ),
        );
      } else if (equals(url, 'elements') && equals(qs, {where: "key = 'bigcommerce-clone'"})) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'bigcommerce-clone')));
      } else {
        return Promise.reject(new Error('not found'));
      }
    });
    http.update.mockImplementation((path, body, account) => {
      if (!equals(account, __ACCOUNT__)) {
        throw new Error('This should never happen');
      }
      if (equals(path, 'elements/adpwfnSDF')) {
        return Promise.resolve(
          head(
            pluck(
              'resources',
              elementsData.filter(element => equals(element.key, 'adpwfnSDF')),
            ),
          ),
        );
      }
    });
    http.post.mockImplementation((path, body, account) => {
      if (!equals(account, __ACCOUNT__)) {
        throw new Error('This should never happen');
      }
      if (equals(path, 'elements/bigcommerce')) {
        return Promise.resolve(
          head(
            pluck(
              'resources',
              elementsData.filter(element => equals(element.key, 'bigcommerce')),
            ),
          ),
        );
      }
    });

    await createElements(__ACCOUNT__, elementsData);
    expect(http.get).toHaveBeenCalledWith(
      Assets.ELEMENTS,
      {
        where:
          "private='true' AND abridged='true' AND key in ('adpwfnSDF','adpworkforcenow','actessentials','bigcommerce','bigcommerce-clone')",
      },
      __ACCOUNT__,
    );
    expect(http.get).toHaveBeenCalledWith(
      Assets.ELEMENTS,
      {
        where:
          "extended='true' AND abridged='true' AND key in ('adpwfnSDF','adpworkforcenow','actessentials','bigcommerce','bigcommerce-clone')",
      },
      __ACCOUNT__,
    );
  });
  it("should be able to create new elements if doesn't exists", async () => {
    let elementsData = await readElementsFromDir(elementsDirectoryPath);
    elementsData = mapIndex((element, index) => ({...element, id: index}), elementsData);
    expect(elementsData).not.toBeNull();
    http.get.mockImplementation((url, qs, account) => {
      if (!equals(account, __ACCOUNT__)) {
        throw new Error('This should never happen');
      }
      if (
        equals(url, 'elements') &&
        equals(qs, {
          where:
            "private='true' AND abridged='true' AND key in ('adpwfnSDF','adpworkforcenow','actessentials','bigcommerce','bigcommerce-clone')",
        })
      ) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'bigcommerce-clone')));
      } else if (
        equals(url, 'elements') &&
        equals(qs, {
          where:
            "extended='true' AND abridged='true' AND key in ('adpwfnSDF','adpworkforcenow','actessentials','bigcommerce','bigcommerce-clone')",
        })
      ) {
        return Promise.resolve([]);
      } else if (equals(url, 'elements') && equals(qs, {where: "key = 'adpworkforcenow'"})) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'adpworkforcenow')));
      } else if (equals(url, 'elements') && equals(qs, {where: "key = 'actessentials'"})) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'actessentials')));
      } else if (equals(url, 'elements') && equals(qs, {where: "key = 'bigcommerce'"})) {
        return Promise.resolve(
          elementsData.filter(
            element => equals(element.key, 'bigcommerce') || equals(element.key, 'bigcommerce-clone'),
          ),
        );
      } else if (equals(url, 'elements') && equals(qs, {where: "key = 'bigcommerce-clone'"})) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'bigcommerce-clone')));
      } else {
        return Promise.reject(new Error('not found'));
      }
    });
    http.update.mockImplementation((path, body, account) => {
      if (!equals(account, __ACCOUNT__)) {
        throw new Error('This should never happen');
      }
      if (equals(path, 'elements/adpwfnSDF')) {
        return Promise.resolve(
          head(
            pluck(
              'resources',
              elementsData.filter(element => equals(element.key, 'adpwfnSDF')),
            ),
          ),
        );
      }
    });
    http.post.mockImplementation((path, body, account) => {
      if (!equals(account, __ACCOUNT__)) {
        throw new Error('This should never happen');
      }
      if (equals(path, 'elements/bigcommerce')) {
        return Promise.resolve(
          head(
            pluck(
              'resources',
              elementsData.filter(element => equals(element.key, 'bigcommerce')),
            ),
          ),
        );
      }
    });

    await createElements(__ACCOUNT__, elementsData);
    expect(http.get).toHaveBeenCalledWith(
      Assets.ELEMENTS,
      {
        where:
          "private='true' AND abridged='true' AND key in ('adpwfnSDF','adpworkforcenow','actessentials','bigcommerce','bigcommerce-clone')",
      },
      __ACCOUNT__,
    );
    expect(http.get).toHaveBeenCalledWith(
      Assets.ELEMENTS,
      {
        where:
          "extended='true' AND abridged='true' AND key in ('adpwfnSDF','adpworkforcenow','actessentials','bigcommerce','bigcommerce-clone')",
      },
      __ACCOUNT__,
    );
  });
  it('should be able to update existing resources if already exists', async () => {
    let elementsData = await readElementsFromDir(elementsDirectoryPath);
    elementsData = mapIndex((element, index) => ({...element, id: index}), elementsData);
    expect(elementsData).not.toBeNull();
    http.get.mockImplementation((url, qs, account) => {
      if (!equals(account, __ACCOUNT__)) {
        throw new Error('This should never happen');
      }
      if (
        equals(url, 'elements') &&
        equals(qs, {
          where:
            "private='true' AND abridged='true' AND key in ('adpwfnSDF','adpworkforcenow','actessentials','bigcommerce','bigcommerce-clone')",
        })
      ) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'bigcommerce-clone')));
      } else if (
        equals(url, 'elements') &&
        equals(qs, {
          where:
            "extended='true' AND abridged='true' AND key in ('adpwfnSDF','adpworkforcenow','actessentials','bigcommerce','bigcommerce-clone')",
        })
      ) {
        return Promise.resolve(elementsData.filter(element => !equals(element.key, 'bigcommerce-clone')));
      } else if (equals(url, 'elements/1')) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'adpworkforcenow')));
      } else if (equals(url, 'elements/2')) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'actessentials')));
      } else if (equals(url, 'elements/3')) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'bigcommerce')));
      } else if (equals(url, 'elements/bigcommerce-clone/resources')) {
        return Promise.resolve(
          head(
            pluck(
              'resources',
              elementsData.filter(element => equals(element.key, 'bigcommerce-clone')),
            ),
          ),
        );
      } else {
        return Promise.reject(new Error('not found'));
      }
    });
    http.update.mockImplementation((path, body, account) => {
      if (!equals(account, __ACCOUNT__)) {
        throw new Error('This should never happen');
      }
      if (equals(path, 'elements/adpwfnSDF')) {
        return Promise.resolve(
          head(
            pluck(
              'resources',
              elementsData.filter(element => equals(element.key, 'adpwfnSDF')),
            ),
          ),
        );
      }
    });
    http.post.mockImplementation((path, body, account) => {
      if (!equals(account, __ACCOUNT__)) {
        throw new Error('This should never happen');
      }
      if (equals(path, 'elements/bigcommerce')) {
        return Promise.resolve(
          pluck(
            'resources',
            elementsData.filter(element => equals(element.key, 'bigcommerce')),
          ),
        );
      }
    });

    await createElements(__ACCOUNT__, elementsData);
    expect(http.get).toHaveBeenCalledWith(
      Assets.ELEMENTS,
      {
        where:
          "private='true' AND abridged='true' AND key in ('adpwfnSDF','adpworkforcenow','actessentials','bigcommerce','bigcommerce-clone')",
      },
      __ACCOUNT__,
    );
    expect(http.get).toHaveBeenCalledWith(
      Assets.ELEMENTS,
      {
        where:
          "extended='true' AND abridged='true' AND key in ('adpwfnSDF','adpworkforcenow','actessentials','bigcommerce','bigcommerce-clone')",
      },
      __ACCOUNT__,
    );
  });
  it('should stop execution if job gets canceled', async () => {
    let elementsData = await readElementsFromDir(elementsDirectoryPath);
    elementsData = mapIndex((element, index) => ({...element, id: index}), elementsData);
    expect(elementsData).not.toBeNull();
    http.get.mockImplementation((url, qs, account) => {
      if (!equals(account, __ACCOUNT__)) {
        throw new Error('This should never happen');
      }
      if (
        equals(url, 'elements') &&
        equals(qs, {
          where:
            "private='true' AND abridged='true' AND key in ('adpwfnSDF','adpworkforcenow','actessentials','bigcommerce','bigcommerce-clone')",
        })
      ) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'bigcommerce-clone')));
      } else if (
        equals(url, 'elements') &&
        equals(qs, {
          where:
            "extended='true' AND abridged='true' AND key in ('adpwfnSDF','adpworkforcenow','actessentials','bigcommerce','bigcommerce-clone')",
        })
      ) {
        return Promise.resolve(elementsData.filter(element => !equals(element.key, 'bigcommerce-clone')));
      } else {
        return Promise.reject(new Error('not found'));
      }
    });
    canceledJob.isJobCancelled.mockResolvedValue(true);
    await createElements(__ACCOUNT__, elementsData, 1, 2);
    expect(http.get).toHaveBeenCalledWith(
      Assets.ELEMENTS,
      {
        where:
          "private='true' AND abridged='true' AND key in ('adpwfnSDF','adpworkforcenow','actessentials','bigcommerce','bigcommerce-clone')",
      },
      __ACCOUNT__,
    );
    expect(http.get).toHaveBeenCalledWith(
      Assets.ELEMENTS,
      {
        where:
          "extended='true' AND abridged='true' AND key in ('adpwfnSDF','adpworkforcenow','actessentials','bigcommerce','bigcommerce-clone')",
      },
      __ACCOUNT__,
    );
  });
  it('should be to handle and throw exception incase of failure', async () => {
    const elementsData = await readElementsFromDir(elementsDirectoryPath);
    expect(elementsData).not.toBeNull();
    http.get.mockImplementation((url, qs, account) => {
      if (!equals(account, __ACCOUNT__)) {
        throw new Error('This should never happen');
      }
      if (
        equals(url, 'elements') &&
        equals(qs, {
          where:
            "private='true' AND abridged='true' AND key in ('adpwfnSDF','adpworkforcenow','actessentials','bigcommerce','bigcommerce-clone')",
        })
      ) {
        return Promise.resolve(elementsData.filter(element => equals(element.key, 'bigcommerce-clone')));
      } else if (
        equals(url, 'elements') &&
        equals(qs, {
          where:
            "extended='true' AND abridged='true' AND key in ('adpwfnSDF','adpworkforcenow','actessentials','bigcommerce','bigcommerce-clone')",
        })
      ) {
        return Promise.resolve(elementsData.filter(element => !equals(element.key, 'bigcommerce-clone')));
      } else {
        return Promise.reject(new Error('Failed to retrieve resource'));
      }
    });
    http.update.mockImplementation(() => new Error('Failed to retrieve resource'));
    http.post.mockImplementation(() => new Error('Failed to retrieve resource'));
    const originalError = console.error;
    console.error = jest.fn();
    canceledJob.isJobCancelled.mockResolvedValue(false);
    try {
      await createElements(__ACCOUNT__, elementsData, 1, 2);
    } catch (error) {
      expect(http.get).toHaveBeenCalledTimes(5);
    }
    expect.assertions(2);
    console.error = originalError;
  });
});
