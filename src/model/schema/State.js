/**
 * @see https://github.com/io-developer/prom-apcupsd-exporter/blob/master/model/state.go
 */
export default class State {
    constructor() {

        // input
        this.InputSensivity = {
            Type: 0,
            Text: '',
        };
        this.InputFrequency = 0;
        this.InputVoltage = 0;
        this.InputVoltageMin = 0;
        this.InputVoltageMax = 0;
        this.InputVoltageNominal = 0;
        this.InputVoltageTransferLow = 0;
        this.InputVoltageTransferHigh = 0;
    
        // output
        this.OutputLoad = 0;
        this.OutputAmps = 0;
        this.OutputPowerNominal = 0;
        this.OutputPowerApparentNomina = 0;
        this.OutputVoltage = 0;
        this.OutputVoltageNominal = 0;
    
        // battery
        this.BatteryCharge = 0;
        this.BatteryVoltage = 0;
        this.BatteryVoltageNominal = 0;
        this.BatteryExternalCount = 0;
        this.BatteryBadCount = 0;
        this.BatteryReplacedDate = 0;
    
        // ups
        this.UpsManafacturedDate = 0;
        this.UpsModel = '';
        this.UpsSerial = '';
        this.UpsFirmware = '';
        this.UpsName = '';
        this.UpsStatus = {
            Text: '',
            Flag: 0,
            FlagChangeCounts: {},
        };
        this.UpsDipSwitchFlag = 0;
        this.UpsReg1 = 0;
        this.UpsReg2 = 0;
        this.UpsReg3 = 0;
        this.UpsTimeleftSeconds = 0;
        this.UpsTimeleftSecondsLowBattery = 0;
        this.UpsTransferOnBatteryCount = 0;
        this.UpsTransferOnBatteryReason = {
            Type: 0,
            Text: '',
        };
        this.UpsTransferOnBatteryDate = 0;
        this.UpsTransferOffBatteryDate = 0;
        this.UpsOnBatterySeconds = 0;
        this.UpsOnBatterySecondsCumulative = 0;
        this.UpsTurnOffDelaySeconds = 0;
        this.UpsTurnOnDelaySeconds = 0;
        this.UpsTurnOnBatteryMin = 0;
        this.UpsTempInternal = 0;
        this.UpsTempAmbient = 0;
        this.UpsHumidity = 0;
        this.UpsAlarmMode = {
            Type: 0,
            Text: '',
        };
        this.UpsSelftestResult = {
            Type: 0,
            Text: '',
        };
        this.UpsSelftestIntervalSeconds = 0;
        this.UpsCable = {
            Type: 0,
            Text: '',
        };
        this.UpsDriver = {
            Type: 0,
            Text: '',
        };
        this.UpsMode = {
            Type: 0,
            Text: '',
        };
    
        // shutdown
        this.ShutdownBatteryMin = 0;
        this.ShutdownTimeleftSecondsMin = 0;
        this.ShutdownOnBatterySecondsMax = 0;
    
        // apcupsd
        this.ApcupsdHost = '';
        this.ApcupsdVersion = '';
        this.ApcupsdStartTime = 0;
    }
}