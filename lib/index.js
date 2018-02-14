import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  AppRegistry,
  StyleSheet,
  Image,
  TextInput,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';


import Flags from './resources/flags'
import PhoneNumber from './phoneNumber'
import styles from './styles';
import CountryPicker from './countryPicker'

export default class PhoneInput extends Component {

    constructor(props, context){
        super(props, context)

        this.onChangePhoneNumber = this.onChangePhoneNumber.bind(this)
        this.onPressFlag = this.onPressFlag.bind(this)
        this.selectCountry = this.selectCountry.bind(this)
        this.getFlag = this.getFlag.bind(this)

        var iso2 = this.props.initialCountry
        var countryData = PhoneNumber.getCountryDataByCode(iso2)
        this.state = {
            iso2,
            value: null
        }
    }

    onChangePhoneNumber(number){
        var actionAfterSetState = this.props.onChangePhoneNumber?() => {this.props.onChangePhoneNumber(number)}:null
        this.setState({
            value: number
        }, actionAfterSetState);
    }

    isValidNumber(){
        return PhoneNumber.isValidNumber(this.state.value, this.state.iso2)
    }

    getNumberType(){
        return PhoneNumber.getNumberType(this.state.value, this.state.iso2)
    }

    getValue(){
        return this.state.value;
    }

    getFlag(iso2){
        return Flags.get(iso2)
    }

    getIso2(){
        return this.state.iso2;
    }

    getAllCountries(){
        return PhoneNumber.getAllCountries()
    }

    getCountryCode() {
        var countryData = PhoneNumber.getCountryDataByCode(this.state.iso2)
        return countryData.dialCode
    }

    getPickerData(){
        return PhoneNumber.getAllCountries().map((country,index) => {return {
            key: index,
            image: Flags.get(country.iso2),
            label: country.name,
            dialCode: `+${country.dialCode}`,
            iso2: country.iso2
        }})
    }

    selectCountry(iso2){
        if(this.state.iso2 != iso2){
            var countryData = PhoneNumber.getCountryDataByCode(iso2)
            if(countryData){
                this.setState({
                    iso2,
                }, ()=>{
                    if(this.props.onSelectCountry)
                        this.props.onSelectCountry(iso2)
                })
            }
        }
    }

    onPressFlag(){
        if(this.props.onPressFlag)
            this.props.onPressFlag()
        else{
            if(this.state.iso2)
                this.refs.picker.selectCountry(this.state.iso2)
            this.refs.picker.show()
        }
    }

    focus(){
	    this.refs.inputPhone.focus()
    }

    render(){
        const TextComponent = this.props.textComponent || TextInput;
        const FlagComponent = this.props.flagComponent;
        return (
            <View style={[styles.container, this.props.style]}>
                <TouchableWithoutFeedback onPress={this.onPressFlag}>
                    <View>
                        <FlagComponent
                            flag={(
                                <Image source={Flags.get(this.state.iso2)}
                                       style={[styles.flag, this.props.flagStyle]}
                                />
                            )}
                            countryCode={this.getCountryCode()}
                        />
                    </View>
                </TouchableWithoutFeedback>
                <View style={{flex:1, marginLeft:this.props.offset || 0}}>
					<TextComponent
						ref='inputPhone'
						autoCorrect={false}
                        style={[styles.text, this.props.textStyle]}
                        onChangeText={(text) => this.onChangePhoneNumber(text)}
                        keyboardType='phone-pad'
                        underlineColorAndroid='rgba(0,0,0,0)'
                        value={this.state.value}
                        {...this.props.textProps}
                    />
                </View>

                <CountryPicker
                    ref={'picker'}
                    selectedCountry={this.state.iso2}
                    onSubmit={this.selectCountry}
                    buttonColor={this.props.pickerButtonColor}
                    buttonTextStyle={this.props.pickerButtonTextStyle}
                    itemStyle={this.props.itemStyle}
                    cancelText={this.props.cancelText}
                    cancelTextStyle={this.props.cancelTextStyle}
                    confirmText={this.props.confirmText}
                    confirmTextStyle={this.props.confirmTextStyle}
                    pickerBackgroundColor={this.props.pickerBackgroundColor}
                    itemStyle={this.props.pickerItemStyle}
                />
            </View>
        )
    }
}

PhoneInput.propTypes = {
  textComponent: PropTypes.func,
  initialCountry: PropTypes.string,
  onChangePhoneNumber: PropTypes.func,
  value: PropTypes.string,
  flagStyle: PropTypes.object,
  textStyle: PropTypes.object,
  offset: PropTypes.number,
  textProps: PropTypes.object,
  onSelectCountry: PropTypes.func,
  pickerButtonColor: PropTypes.string,
  pickerBackgroundColor: PropTypes.string,
  cancelText: PropTypes.string,
  cancelTextStyle: PropTypes.object,
  confirmText: PropTypes.string,
  confirmTextTextStyle: PropTypes.object,
}
