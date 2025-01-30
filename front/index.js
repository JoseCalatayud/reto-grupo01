$(function() {
    function getPartidos() {
        $('tbody').empty();
        $('zonaDetalle').hide();
        $.ajax({
            url: "http://localhost:1234/api/partidos",
            success: function(data) {
                data.forEach((element)=>{
                    $('tbody').append($('<tr>').append($('<td>').text(element.nombre)).append($('<td>').text(element.deporte)).append($('<td>').attr('class', 'precio').text(parseFloat(element.apuesta).toFixed(2) + " \u20AC")).append($('<td>').attr('class', 'tdBotones').append($('<button>').addClass('btn btn-dark btn-sm botonMaestro borrar').attr('data-id', element.id).text('Borrar')).off()).append($('<td>').attr('class', 'tdBotones').append($('<button>').addClass('btn btn-dark btn-sm botonMaestro comprar').attr('data-id', element.id).text('Comprar'))).append($('<td>').attr('class', 'tdBotones').append($('<button>').addClass('btn btn-dark btn-sm botonMaestro detalle').attr('data-id', element.id).text('Detalle'))));
                });
            },
            error: function(error) {
                mostrarError("Error al listar los productos");
                console.log(error);
            },
            complete: function(data) {
                $('tbody').on('click', '.botonMaestro.borrar', function(event) {
                    event.stopPropagation();
                    var id = $(this).data('id');
                    mostrarModalConfirmacion('Borrar producto', 'Confirmar borrado', ()=>{
                        borrarProducto(id);
                    });
                    console.log('Hola desde botonBorrar');
                });
                $('tbody').on('click', '.botonMaestro.comprar', function(event) {
                    event.stopPropagation();
                    var id = $(this).data('id');
                    mostrarModalConfirmacion('Comprar producto', 'Confirmar compra', ()=>{
                        comprarProducto(id);
                    });
                });
                $('tbody').on('click', '.botonMaestro.detalle', function(event) {
                    event.stopPropagation();
                    var id = $(this).data('id');
                    console.log('Hola desde boton VerDetalle');
                    verDetalleProducto(id);
                    $('#tituloDetalle').text('Detalles del producto');
                    $('#botonCambios').text('Modificar').off().on('click', function() {
                        if (verificarCampos()) mostrarModalConfirmacion('Modificar producto', "\xbfModificar producto?", ()=>{
                            guardarDatos();
                        });
                    });
                });
            }
        });
    }
    getPartidos();
});


//# sourceMappingURL=index.js.map
