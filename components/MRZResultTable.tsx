import React from 'react';
import {StyleSheet, Text, View, Dimensions, TextInput} from 'react-native';
import {
  DLRCharacherResult,
  DLRLineResult,
} from 'vision-camera-dynamsoft-label-recognizer';
const parse = require('mrz').parse;

export const MRZResultTable = (props: {
  recognitionResults: DLRLineResult[];
}) => {
  const [parsedResult, setParsedResult] = React.useState(undefined as any);

  const RecognizedCharacter = (props: {char: DLRCharacherResult}) => {
    if (props.char.characterHConfidence > 50) {
      return <Text>{props.char.characterH}</Text>;
    } else {
      return (
        <Text style={[styles.lowConfidenceText]}>{props.char.characterH}</Text>
      );
    }
  };

  const getText = () => {
    let text = '';
    props.recognitionResults.forEach(result => {
      text = text + result.text + '\n';
    });
    return text.trim();
  };

  React.useEffect(() => {
    // console.log('use effect');
    console.log(props.recognitionResults);
    if (props.recognitionResults) {
      const raw = getText();
      console.log('raw', raw);
      let fields: any = {};
      try {
        const result = parse(raw);
        console.log(result.details[10].ranges);
        fields['Document Code'] = result['fields']['documentCode'];
        fields['Document Number'] = result['fields']['documentNumber'];
        fields['First Name'] = result['fields']['firstName'];
        fields['Last Name'] = result['fields']['lastName'];
        var bDate = result['fields']['birthDate'];
        fields['Birth Date'] =
          bDate.substring(4, 6) +
          '/' +
          bDate.substring(2, 4) +
          '/' +
          formatYear(bDate.substring(0, 2));
        fields['Sex'] = result['fields']['sex'];
        fields['Nationality'] = result['fields']['nationality'];
        fields['Issuing State'] = result['fields']['issuingState'];
        var expDate = result['fields']['expirationDate'];
        fields['Expiration Date'] =
          expDate.substring(4, 6) +
          '/' +
          expDate.substring(2, 4) +
          '/' +
          expDate.substring(0, 2);
        // if (result['valid'] === true) {
        //   fields['Valid'] = 'True';
        // } else {
        //   fields['Valid'] = 'False';
        // }
        fields['MRZ Code'] = (
          <>
            {props.recognitionResults.map((result, idx) => (
              <Text style={{color: 'black'}} key={'line-' + idx}>
                {result.characterResults.map((char, cidx) => (
                  <RecognizedCharacter key={'char-' + cidx} char={char} />
                ))}
              </Text>
            ))}
          </>
        );
      } catch (error) {
        console.log('eerrororror', error);
        fields['text'] = raw;
      }
      console.log(fields);
      setParsedResult(fields);
    }
  }, [props.recognitionResults]);

  const formatYear = year => {
    var currYear = new Date().getFullYear().toString().substring(2, 4);
    var currPre = new Date().getFullYear().toString().substring(0, 2);
    if (parseInt(year) >= 0 && parseInt(year) <= parseInt(currYear)) {
      return currPre + '' + year;
    } else {
      return parseInt(currPre) - 1 + year;
    }
  };

  const getRows = () => {
    let rows: Element[] = [];
    let index = 0;
    if (parsedResult) {
      for (let key in parsedResult) {
        index = index + 1;
        let row = (
          <View
            key={'row-' + index}
            style={{
              flexDirection: 'row',
            }}>
            <View style={styles.cell}>
              <Text style={{color: 'black'}}>{key}</Text>
            </View>
            <View style={styles.cell}>
              <Text style={{color: 'black'}}>{parsedResult[key]}</Text>
            </View>
          </View>
        );
        rows.push(row);
      }
    }
    return rows;
  };
  const onChange = (key, value) => {
    var detailsData = {...parsedResult};
    console.log(detailsData);

    detailsData[key] = value;
    console.log(detailsData);
    setParsedResult({...detailsData});
  };
  return (
    <>
      {parsedResult &&
        Object.keys(parsedResult).map((key, index) => {
          return (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                display: 'flex',
              }}>
              <View style={styles.cell}>
                <Text style={{color: 'black', margin: 5}}>{key}</Text>
              </View>
              <View style={styles.cell}>
                {key != 'MRZ Code' ? (
                  <TextInput
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.1)',
                      color: 'black',
                      padding: 0,
                      paddingLeft: 5,
                    }}
                    value={parsedResult[key]}
                    onChangeText={text => onChange(key, text)}
                  />
                ) : (
                  <Text style={{color: 'black'}}>{parsedResult[key]}</Text>
                )}
              </View>
            </View>
          );
        })}
    </>
  );
};

const styles = StyleSheet.create({
  cell: {
    borderColor: 'black',
    borderWidth: 0.5,
    flex: 0.5,
  },
  lowConfidenceText: {
    color: 'red',
  },
});
