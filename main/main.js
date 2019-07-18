'use strict';

//expect : 15min    actual:19min
function printReceipt(tags) {
    var allItems = loadAllItems();
    let promotion = loadPromotions()[0].barcodes;
    let orderArr = findShoppingCartByBarcode(tags, allItems, promotion);
    let receiptString = printReceiptString(orderArr);
    console.log(receiptString);
}

function findShoppingCartByBarcode(tags, allItems, promotion) {
    let orderArr = [];
    let itemAndCount = getShoppingCartCount(tags);
    allItems.map(item => {
        if (item.barcode in itemAndCount) {
            let obj = {};
            let count = itemAndCount[item.barcode];
            obj.item = item;
            obj.number = count;
            obj.sourceMoney = getTwoDecimal(item.price * count);
            if (promotion.includes(item.barcode)) {
                obj.totalMoney = getTwoDecimal(item.price * count);
                if (count >= 2) {
                    obj.totalMoney = getTwoDecimal(item.price * count - (item.price));
                }
            } else {
                obj.totalMoney = getTwoDecimal(item.price * count);
            }
            orderArr.push(obj);
        }
    });
    return orderArr;
}

function getShoppingCartCount(tags) {
    let barcode, barcodeCount;
    return tags.reduce(function (items, tagsBarcode) {
        var splitBarcode = tagsBarcode.split('-');
        if (splitBarcode.length > 1) {
            barcode = splitBarcode[0];
            barcodeCount = Number(splitBarcode[1]);
        } else {
            barcode = tagsBarcode;
            barcodeCount = 1;
        }
        items[barcode] ? items[barcode] += barcodeCount : items[barcode] = barcodeCount;
        return items;
    }, {});
}

function getTwoDecimal(num) {
    return num.toFixed(2);
}


function printReceiptString(orderArr) {
    let receipt = "***<没钱赚商店>收据***\n";
    var totalMoney = 0;
    var sourceMoney = 0;
    orderArr.forEach(element => {
        totalMoney += Number.parseFloat(element.totalMoney);
        sourceMoney += Number.parseFloat(element.sourceMoney);
        receipt += `名称：${element.item.name}，数量：${element.number}${element.item.unit}，单价：${element.item.price.toFixed(2)}(元)，小计：${element.totalMoney}(元)` + "\n";
    });
    receipt += "----------------------\n";
    receipt += `总计：${totalMoney.toFixed(2)}(元)` + "\n";
    receipt += `节省：${(sourceMoney - totalMoney).toFixed(2)}(元)` + "\n";
    receipt += "**********************";
    return receipt;
}
