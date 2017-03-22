/**
 * Created by dat on 3/22/17.
 */
var hic = (function (hic) {

    hic.ChromosomeSelectorWidget = function (browser) {

        var self = this,
            $label,
            $option,
            $selector_container,
            $doit,
            config;

        this.browser = browser;

        $label = $('<label>');
        $label.text('Chromosomes');

        // x-axis
        this.$x_axis_selector = $('<select name="x-axis-selector">');
        this.$x_axis_selector.on('change', function (e) {
            // console.log('x-axis chr is', $(this).val());
        });

        // y-axis
        this.$y_axis_selector = $('<select name="y-axis-selector">');
        this.$y_axis_selector.on('change', function (e) {
            // console.log('y-axis chr is', $(this).val());
        });

        this.$container = $('<div class="hic-chromosome-selector-widget-container">');

        this.$container.append($label);

        $selector_container = $('<div>');

        $option = $('<option value="">');
        $option.text('---');
        this.$x_axis_selector.append($option);
        $selector_container.append(this.$x_axis_selector);

        $option = $('<option value="">');
        $option.text('---');
        this.$y_axis_selector.append($option);
        $selector_container.append(this.$y_axis_selector);

        this.$container.append($selector_container);

        $doit = $('<i class="fa fa-arrow-circle-right" aria-hidden="true">');
        $doit.on('click', function (e) {
            var state = self.browser.state.clone();
            state.chr1 = self.$x_axis_selector.find('option:selected').val();
            state.chr2 = self.$y_axis_selector.find('option:selected').val();

            self.browser.setState(state);

        });


        this.$container.append($doit);

        config = {
            receiveEvent: function (event) {
                if (event.type === "DataLoad") {
                    self.updateWithDataset(event.data);
                }
            }
        };

        hic.GlobalEventBus.subscribe("DataLoad", config);

    };

    hic.ChromosomeSelectorWidget.prototype.updateWithDataset = function(dataset) {

        var selected,
            elements,
            names;

        this.$x_axis_selector.empty();
        this.$y_axis_selector.empty();


        names = _.map(dataset.chromosomes, function (chr){
            return chr.name;
        });

        selected = false;
        elements = _.map(names, function (name) {
            return '<option' + ' value=' + name + (selected ? ' selected' : '') + '>' + name + '</option>';
        });

        this.$x_axis_selector.append(elements.join(''));
        this.$y_axis_selector.append(elements.join(''));

    };

    return hic;

}) (hic || {});

