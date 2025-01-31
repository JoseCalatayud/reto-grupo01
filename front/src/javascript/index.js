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
                mostrarError("Error al listar los partidos")
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
                    mostrarModalConfirmacion('Borrar Partido', 'Confirmar', () => {
                        borrarPartido(id);
                    });
                   
                });

                $('tbody').on('click', '.botonMaestro.ganar', function (event) {

                    event.stopPropagation();
                    var id = $(this).data('id');
                    mostrarModalConfirmacion('Modificar Resultado', 'Confirmar', () => {
                        ganar(id);
                    });
                    
                });
                $('tbody').on('click', '.botonMaestro.perder', function (event) {

                    event.stopPropagation();
                    var id = $(this).data('id');
                    mostrarModalConfirmacion('Modificar Resultado', 'Confirmar', () => {
                        perder(id);
                    });
                   
                });
                $('tbody').on('click', '.botonMaestro.detalle', function (event) {

                    event.stopPropagation();
                    var id = $(this).data('id');
                    console.log('Hola desde boton VerDetalle');
                    verDetallePartido(id);
                    $('#tituloDetalle').text('Detalles del partido');
                    $('#botonCambios').text('Modificar').off().on('click', function () {
                        if (verificarCampos()) {
                            mostrarModalConfirmacion('Modificar partido', '¿Modificar partido?', () => {
                                guardarDatosPartido();
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
                mostrarError("Fallo al eliminar el partido")
                console.log(error)
            },

        })
    }
    function verDetallePartido(id) {
        $.ajax({
            url: `http://localhost:1234/api/partidos/${id}`,
            success: function (data) {
                $('#id').val(data.id)
                $('#nombrePartido').val(data.nombre)
                $('#descripcionPartido').val(data.descripcion)
                $('#deporte').val(data.deporte)
                $('#resultado').val((data.resultado))
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
    function insertarPartido(datos) {
        $.ajax({
            url: "http://localhost:1234/api/partidos",
            type: "POST",
            data: JSON.stringify(datos),
            contentType: "application/json",
            success: function (respuesta) {
                console.log(respuesta)
                refrescar()
            },
            error: (error) => {
                mostrarError('Fallo al guardar el partido')
            }
        })
    }
    function modificarPartido(id, datos) {

        $.ajax({
            url: `http://localhost:1234/api/partidos/${id}`,
            type: "PUT",
            data: JSON.stringify(datos),
            contentType: "application/json",
            success: function (data) {
                refrescar()
            },
            error: function (error) {
                mostrarError('Fallo al modificar el partido')
                console.log(error)
            }
        })
    }
    function guardarDatosPartido() {

        
        let id = $('#id').val();
        let nombre = $('#nombrePartido').val()
        let descripcion = $('#descripcionPartido').val();
        let deporte = $('#deporte').val();
        let resultado = $('#resultado').val();
        let apuesta = ($('#apuestaPartido').val()).replace(/\s?€/g, '');
        let datos = {
            "id": id,
            "nombre": nombre,
            "descripcion": descripcion,
            "deporte": deporte,
            "resultado": resultado,
            "apuesta": apuesta
        }
        if (datos.id != 0) {
            limpiarDetalle()
            modificarPartido(id, datos)

        } else {
            limpiarDetalle()
            insertarPartido(datos);
        }


    }
    function mostrarDetalle() {
        $('.zonaDetalle').show();
        $('button.botonMaestro').prop('disabled', true);
    }
    
    function refrescar() {
        $('.zonaDetalle').hide();
        $('#botonCambios').off()
        getPartidos();
    }
    function limpiarDetalle() {
        $('.zonaDetalle').hide();
        $('#id').val(0);
        $('#nombrePartido').val('')
        $('#descripcionPartido').val('');
        $('#deporte').val('');
        $('#resultado').val('');
        $('#apuestaPartido').val('');
    }
    function mostrarModalConfirmacion(titulo, mensaje, callback) {
        $('#miModalLabel').text(titulo);
        $('#preguntaModal').text(mensaje);
        $('#miModal').modal('show');
        $('#confirmarAccion').off().click(function () {
            callback();
            $('#miModal').modal('hide');
        });
    }

    function verificarCampos() {
        let id = $('#id').val();
        let nombre = $('#nombrePartido').val().trim();
        let descripcion = $('#descripcionPartido').val().trim();
        let deporte = $('#deporte').val().trim();
        let resultado = $('#resultado').val();
        let apuesta = $('#apuestaPartido').val().trim().replace(/\s?€/g, '');

        if (!nombre) {
            mostrarError("Partido es un campo obligatorio.");
            return false;
        }

        if (!descripcion) {
            mostrarError("La descripción es obligatoria.");
            return false;
        }
        if (!deporte) {
            mostrarError("Deporte es un campo obligatorio.");
            return false;
        }
        if (!resultado) {
            mostrarError("Resultado del partido es obligatorio.");
            return false;
        }

        if (!apuesta || isNaN(apuesta) || parseInt(apuesta) < 0) {
            mostrarError("La cantidad debe ser un número válido y no negativo.");
            return false;
        }

        

        return true;
    }
    function mostrarError(mensaje) {
        $('#preguntaModalValidar').text(mensaje);
        $('#miModalValidar').modal('show');
    }
    getPartidos()

    $('#botonCancelar').on('click', function () {
        refrescar()
    })
    $('#añadir').on('click', function () {
        limpiarDetalle();
        $('#tituloDetalle').text('Datos del nuevo partido')
        mostrarDetalle();
        $('#botonCambios').text('Crear Partido').off().on('click', function () {
            if (verificarCampos()) {
                $('#miModalLabel').text('Añadir partido')
                $('#preguntaModal').text('¿Seguro que quieres añadir?')
                $('#miModal').modal('show');
                $('#confirmarAccion').off().click(function () {
                    guardarDatosPartido();
                    $('#miModal').modal('hide');
                });

            }
            
        })
        
        
    })
    $('#refrescar').on('click', function () {
        refrescar()
    })
    $('.zonaDetalle').hide();
})