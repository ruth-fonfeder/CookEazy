const { DataTypes } = require('sequelize');
const sequelize = require('../dbSql');
const Instructions = require('./instructions');


const Recipe = sequelize.define('recipe', {
    Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    Img: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    Duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Difficulty: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    // Categoryid: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    // },
   
    
});


module.exports = Recipe;



