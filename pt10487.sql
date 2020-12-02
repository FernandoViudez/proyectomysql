
--
-- Base de datos: `marcos`
--

--
-- Volcado de datos para la tablas
--

INSERT INTO `prodterm` (`id`, `descripcion`, `color`, `colorigual`, `componente`, `formaconjunto`, `relaciondemezcla`, `tipogenerico`, `unidadmedida`, `pesoespecifico`, `viscosidadspindle`, `spindlenumero`, `viscosidaduk`, `molienda`, `brillo`, `solidosppp`, `solidosppv`, `resina`, `pigmento`, `solvente`, `fechaultimaelaboracion`, `precio`, `ultimamodificacion`, `info1`, `info2`, `info3`, `stock`) VALUES
(10487, 'REVESTA 4400', 'AZUL CAPRI / 070', 'REVESTA 290 R-4870', 'RESINA', 10482, '4:1 POR VOLUMEN', 'ESMALTE POLIURETANICO', 'LT', 1.13, '400-2500', '3/30', '<72', '0-1', '<85', 60.9, 51.28, 67.5, 16.72, 15.78, '2020-12-02', 0, '2016-03-31', NULL, NULL, NULL, 0);

INSERT INTO `proconj` (`id`, `envasado`, `codmp`, `descripcion`, `cobarras`, `indice`) VALUES
(10487, 0.4, 39340, 'LATA 1/2 LT REVESTIDA INTERIOR', '77901048700105', 1),
(10487, 0.8, 39040, 'LATA 1 LT BRILLANTE REVEST.EPX', '779010487001', 2),
(10487, 3.2, 39360, 'LATA 4 LT BRILLANTE REVEST.EPX', '779010487004', 3),
(10487, 16, 39070, 'PEIL 20 LITROS APILABLE', '779010487020', 4);

INSERT INTO `proasoc` (`idprod`, `tintoformoalt`, `orden`, `mpi`, `codmp`, `codpt`, `descripcion`, `cantidad`, `ind`) VALUES
(10487, 'T', 1, 'I', NULL, NULL, 'BASE A UTILIZAR:', NULL, 1),
(10487, 'T', 2, 'I', NULL, NULL, '                 BASICO NEUTRO', NULL, 2),
(10487, 'T', 3, 'I', NULL, NULL, 'FORMULA CARGADA EN BASE DE DATOS PC TINTURADO', NULL, 3);


