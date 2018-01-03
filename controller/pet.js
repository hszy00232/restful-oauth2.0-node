var Pet = require('../models/pet');

// var postPets = function(req, res) {
//     // 创建Pet模型的一个实例
//     var pet = new Pet();
//     // 使用Post数据设置这个实例的属性
//     pet.name = req.body.name;
//     pet.type = req.body.type;
//     pet.quantity = req.body.quantity;
//     pet.userId = req.body.userId;
//     // 保存实例并检查错误
//     pet.save(function(err) {
//         if (err) {
//             res.json({ message: 'error', data: err });
//             return;
//         }
//         res.json({ message: 'done', data: pet });
//     });
// };
// var getPets = function(req, res) {
//     Pet.find(function(err, pets) {
//         if (err) {
//             res.json({ message: 'error', data: err });
//             return;
//         }
//         res.json({ message: 'done', data: pets });
//     });
// };
// var getPet = function(req, res) {
//     Pet.findById({ _id: req.params.pet_id }, function(err, pet) {
//         if (err) {
//             res.json({ message: 'error', data: err });
//             return;
//         }
//         res.json({ message: 'done', data: pet });
//     });
// };
// var updatePet = function(req, res) {
//     Pet.update({ _id: req.params.pet_id }, { quantity: req.body.quantity }, function(err, num) {
//         if (err) {
//             res.json({ message: 'error', data: err });
//         }
//         res.json({ message: ' update' })
//     })
// };
// var deletePet = function(req, res) {
//     Pet.remove({ _id: req.params.pet_id }, function(err) {
//         if (err) {
//             res.json({ message: 'error', data: err });
//         }
//         res.json({ message: 'pet remove!' })
//     });
// };



var postPets = function(req, res) {
    // 创建Pet模型的一个实例
    var pet = new Pet();
    // 使用Post数据设置这个实例的属性
    pet.name = req.body.name;
    pet.type = req.body.type;
    pet.quantity = req.body.quantity;
    pet.userId = req.user._id;

    // 保存实例并检查错误
    pet.save(function(err) {
        if (err) {
            res.json({ message: 'error', data: err });
            return;
        }
        res.json({ message: 'done', data: pet });
    });
};

var getPets = function(req, res) {
    Pet.find({ userId: req.user._id }, function(err, pets) {
        if (err) {
            res.json({ message: 'error', data: err });
            return;
        }
        res.json({ message: 'done', data: pets });
    });
};

var getPet = function(req, res) {
    Pet.findById({ userId: req.user._id, _id: req.params.pet_id }, function(err, pet) {
        if (err) {
            res.json({ message: 'error', data: err });
            return;
        }
        res.json({ message: 'done', data: pet });
    });
};

var updatePet = function(req, res) {
    Pet.update({ userId: req.user._id, _id: req.params.pet_id }, { quantity: req.body.quantity }, function(err, num) {
        if (err) {
            res.json({ message: 'error', data: err });
        }
        res.json({ message: ' update' })
    })
};

var deletePet = function(req, res) {
    Pet.remove({ userId: req.user._id, _id: req.params.pet_id }, function(err) {
        if (err) {
            res.json({ message: 'error', data: err });
        }
        res.json({ message: 'pet remove!' })
    });
};

module.exports = {
    postPets: postPets,
    getPets: getPets,
    getPet: getPet,
    updatePet: updatePet,
    deletePet: deletePet
}