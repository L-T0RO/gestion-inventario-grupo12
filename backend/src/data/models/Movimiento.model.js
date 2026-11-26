const { DataTypes } = require('sequelize');

function defineMovimientoModel(sequelize) {
return sequelize.define(
    'Movimiento',
    {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    productoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'producto_id',
    },
    tipo: {
        type: DataTypes.ENUM('INGRESO', 'EGRESO'),
        allowNull: false,
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
        min: 1,
        },
    },
    usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'usuario_id',
    },
    fechaHora: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'fecha_hora',
    },
    observacion: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: '',
    },
    },
    {
    tableName: 'movimientos',
    timestamps: true,
    underscored: true,
    }
);
}

module.exports = defineMovimientoModel;