const Storage = artifacts.require('Storage.sol');


contract('Storage', () => {
    
    it('Should add 1', async () => {
        const storage = await Storage.new();
        await storage.setMap("1");
        const data = await storage.existsHashFile("1");
        assert(data.toString() == "1");
    });

    it('Should add 2', async () => {
        const storage = await Storage.new();
        await storage.setMap("2");
        const data = await storage.existsHashFile("2");
        assert(data.toString() == "2");
    });

    it('Try to get 3, which it does not exist, so returns empty', async () => {
        const storage = await Storage.new();
        const data = await storage.existsHashFile("3");
        assert(data.toString() == "");
    });

    it('Should add hola', async () => {
        const storage = await Storage.new();
        await storage.setMap("hola");
        const data = await storage.existsHashFile("hola");
        assert(data.toString() == "hola");
    });

    it('Should add DFGER2345FGD', async () => {
        const storage = await Storage.new();
        await storage.setMap("DFGER2345FGD");
        const data = await storage.existsHashFile("DFGER2345FGD");
        assert(data.toString() == "DFGER2345FGD");
    });

    it('Should try to add twice DFGER2345FGD ', async () => {
        const storage = await Storage.new();
        await storage.setMap("DFGER2345FGD");
        await storage.setMap("DFGER2345FGD");
        const data = await storage.existsHashFile("DFGER2345FGD");
        assert(data.toString() == "DFGER2345FGD");
    });

    it('Should try to add 3 elements: DFGER2345FGD, 4, 4356345', async () => {
        const storage = await Storage.new();
        await storage.setMap("DFGER2345FGD");
        await storage.setMap("4");
        await storage.setMap("4356345");
        const data1 = await storage.existsHashFile("DFGER2345FGD");
        const data2 = await storage.existsHashFile("4");
        const data3 = await storage.existsHashFile("4356345");
        assert(data1.toString() == "DFGER2345FGD");
        assert(data2.toString() == "4");
        assert(data3.toString() == "4356345");
    });

    it('Should try to get an element not in the hashSet', async () => {
        const storage = await Storage.new();
        await storage.setMap("4");
        const data1 = await storage.existsHashFile("DFGER2345FGD");
        assert(data1.toString() == "");
    });

});