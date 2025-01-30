$(function () {
    function getPartidos() {
        $('tbody').empty();
        $('zonaDetalle').hide();
        $.ajax({
            url: "http://localhost:1234/api/partidos",
            success: function (data) {
                data.forEach(element => {
                    $('tbody').append($('<tr>')
                        .append($('<td>').text(element.nombre))
                        .append($('<td>').text(element.deporte))
                        .append($('<td>').attr('class', 'precio').text(parseFloat(element.apuesta).toFixed(2) + " €"))
                        .append($('<td>').text(mostrarResultado(element.resultado)))
                        .append($('<td>').attr('class', 'tdBotones')
                            .append($('<button>')
                                .addClass('btn btn-dark btn-sm botonMaestro ganar')
                                .attr('data-id', element.id)
                                .text('Ganar'))


                        )
                        .append($('<td>').attr('class', 'tdBotones')
                            .append($('<button>')
                                .addClass('btn btn-dark btn-sm botonMaestro perder')
                                .attr('data-id', element.id)
                                .text('Perder'))


                        )
                        .append($('<td>').attr('class', 'tdBotones')
                            .append($('<button>')
                                .addClass('btn btn-dark btn-sm botonMaestro borrar')
                                .attr('data-id', element.id)
                                .text('Borrar'))

                        )
                        .append($('<td>').attr('class', 'tdBotones')
                            .append($('<button>')
                                .addClass('btn btn-dark btn-sm botonMaestro detalle')
                                .attr('data-id', element.id)
                                .text('Ver Detalle'))

                        )
                    );

                });
            },
            error: function (error) {
                mostrarError("Error al listar los productos")
                console.log(error)
            },
            complete: function (data) {
                $('tbody').off('click', '.botonMaestro.borrar');
                $('tbody').off('click', '.botonMaestro.ganar');
                $('tbody').off('click', '.botonMaestro.perder');
                $('tbody').off('click', '.botonMaestro.detalle');

                $('tbody').on('click', '.botonMaestro.borrar', function (event) {

                    event.stopPropagation();
                    var id = $(this).data('id');
                    borrarPartido(id);
                    console.log('Hola desde botonBorrar');
                });

                $('tbody').on('click', '.botonMaestro.ganar', function (event) {

                    event.stopPropagation();
                    var id = $(this).data('id');
                    setTimeout(ganar(id),1000)
                });
                $('tbody').on('click', '.botonMaestro.perder', function (event) {

                    event.stopPropagation();
                    var id = $(this).data('id');
                    setTimeout(perder(id), 3000);
                });
                $('tbody').on('click', '.botonMaestro.detalle', function (event) {

                    event.stopPropagation();
                    var id = $(this).data('id');
                    console.log('Hola desde boton VerDetalle');
                    verDetalleProducto(id);
                    $('#tituloDetalle').text('Detalles del producto');
                    $('#botonCambios').text('Modificar').off().on('click', function () {
                        if (verificarCampos()) {
                            mostrarModalConfirmacion('Modificar producto', '¿Modificar producto?', () => {
                                guardarDatos();
                            });
                        }
                    });
                });
            }


        })
    }
    function mostrarResultado(resultado) {

        switch (resultado) {
            case 1:
                return "Victoria";
            case -1:
                return "Derrota";
            case 0:
                return "Empate";
            default:
                return "error";
        }
    }
    function borrarPartido(id) {
        $.ajax({
            url: `http://localhost:1234/api/partidos/${id}`,
            type: 'DELETE',
            success: function (data) {
                refrescar()

            },
            error: function (error) {
                //mostrarError("Fallo al eliminar el partido")
                console.log(error)
            },

        })
    }
    function verDetalleProducto(id) {
        $.ajax({
            url: `http://localhost:1234/api/partidos/${id}`,
            success: function (data) {
                $('#id').val(data.id)
                $('#nombrePartido').val(data.nombre)
                $('#descripcionPartido').val(data.descripcion)
                $('#deporte').val(data.deporte)
                $('#resultado').val(mostrarResultado(data.resultado))
                $('#apuestaPartido').val(parseFloat(data.apuesta).toFixed(2) + ' €')

                if (data.id >= 0) {
                    mostrarDetalle();
                    $('#botonCambios')
                        .text('Modificar')
                }
            },
            error: function (error) {
                mostrarError("Error al recuperar los datos");
                console.log(error)
            },
        })
    }
    function ganar(id) {
        $.ajax({
            url: `http://localhost:1234/api/partidos/${id}/gana`,
            type: "POST",
            success: function (respuesta) {

            },
            error: function (error) {
                console.log(error.responseText);
            },
            complete: function () {
                refrescar()
            }
        })
    }
    function perder(id) {
        $.ajax({
            url: `http://localhost:1234/api/partidos/${id}/pierde`,
            type: "POST",
            success: function (respuesta) {
                
            },
            error: function (error) {
                console.log(error.responseText);
            },
            complete: function () {
                refrescar()
            }
        })
    }
    function mostrarDetalle() {
        $('.zonaDetalle').show();
        //$('button.botonMaestro').prop('disabled', true);
    }

    function refrescar() {
        $('.zonaDetalle').hide();
        //$('#botonCambios').off()
        getPartidos();
    }

    getPartidos()
    $('#refrescar').on('click', function () {
        refrescar()
    })
    $('.zonaDetalle').hide();
})